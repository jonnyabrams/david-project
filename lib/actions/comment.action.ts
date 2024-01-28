"use server";

import { revalidatePath } from "next/cache";
import { Knock } from "@knocklabs/node";

import Comment from "@/models/comment.model";
import { connectToDatabase } from "../db";
import {
  CommentVoteParams,
  CreateCommentParams,
  DeleteCommentParams,
  GetCommentsParams,
} from "./shared.types";
import Post from "@/models/post.model";
import Interaction from "@/models/interaction.model";
import User from "@/models/user.model";

const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY);

export const createComment = async (params: CreateCommentParams) => {
  try {
    connectToDatabase();

    const { content, author, post, path } = params;

    const newComment = await Comment.create({
      content,
      author,
      post,
    });

    // add comment to the post's comments array
    const postObject = await Post.findByIdAndUpdate(post, {
      $push: { comments: newComment._id },
      $inc: { commentCount: 1 },
    });

    await Interaction.create({
      user: author,
      action: "create_comment",
      post,
      comment: newComment._id,
      tags: postObject.tags,
    });

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 },
    });

    await knockClient.notify("new-comment", {
      actor: author,
      recipients: [postObject.author._id],
      data: {
        post: {
          title: postObject.title,
        },
      },
    });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getComments = async (params: GetCommentsParams) => {
  try {
    connectToDatabase();

    const { postId, filter, page = 1, limit = 10 } = params;

    const skipAmount = (page - 1) * limit;

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_upvoted":
        sortOptions = { upvotesCount: -1 };
        break;
      default:
        break;
    }

    const comments = await Comment.find({ post: postId })
      .populate("author", "_id clerkId salutation firstName surname picture")
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(limit);

    const totalComments = await Comment.countDocuments({
      post: postId,
    });

    const isNext = totalComments > skipAmount + comments.length;

    return { comments, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const upvoteComment = async (params: CommentVoteParams) => {
  try {
    connectToDatabase();

    const { commentId, userId, userHasUpvoted, userHasDownvoted, path } =
      params;

    let updateQuery = {};

    if (userHasUpvoted) {
      updateQuery = { $pull: { upvotes: userId }, $inc: { upvoteCount: -1 } };
    } else if (userHasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
        $inc: { downvoteCount: -1, upvoteCount: 1 },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
        $inc: { upvoteCount: 1 },
      };
    }

    const comment = await Comment.findByIdAndUpdate(commentId, updateQuery, {
      new: true,
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // +2 reputation for upvoting a comment
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: userHasUpvoted ? -2 : 2 },
    });

    // +10 reputation for receiving an upvote
    await User.findByIdAndUpdate(comment.author, {
      $inc: { reputation: userHasUpvoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const downvoteComment = async (params: CommentVoteParams) => {
  try {
    connectToDatabase();

    const { commentId, userId, userHasUpvoted, userHasDownvoted, path } =
      params;

    let updateQuery = {};

    if (userHasDownvoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (userHasUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const comment = await Comment.findByIdAndUpdate(commentId, updateQuery, {
      new: true,
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // -10 reputation for receiving a downvote
    await User.findByIdAndUpdate(comment.author, {
      $inc: { reputation: userHasDownvoted ? 10 : -10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteComment = async (params: DeleteCommentParams) => {
  try {
    connectToDatabase();

    const { commentId, path } = params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    await Comment.deleteOne({ _id: commentId });

    // pull comment from post
    await Post.updateMany(
      { _id: comment.post },
      { $pull: { comments: commentId }, $inc: { commentCount: -1 } }
    );

    // delete its interactions
    await Interaction.deleteMany({ comment: commentId });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
