"use server";

import { revalidatePath } from "next/cache";

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
    await Post.findByIdAndUpdate(post, { $push: { comments: newComment._id }, $inc: { commentCount: 1 } });

    // TODO: add interaction to increase reputation

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getComments = async (params: GetCommentsParams) => {
  try {
    connectToDatabase();

    const { postId, filter } = params;

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
      .sort(sortOptions);

    return { comments };
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
        $inc: { downvoteCount: -1, upvoteCount: 1 }
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId }, $inc: { upvoteCount: 1 } };
    }

    const comment = await Comment.findByIdAndUpdate(commentId, updateQuery, {
      new: true,
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // increment author's reputation

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

    // increment author's reputation

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
