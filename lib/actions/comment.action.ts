"use server";

import { revalidatePath } from "next/cache";
import { Knock } from "@knocklabs/node";

import Comment from "@/models/comment.model";
import { connectToDatabase } from "../db";
import {
  CommentLikeParams,
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
          link:
            process.env.NODE_ENV === "production"
              ? `${process.env.BASE_URL}/post/${postObject._id}`
              : `http://localhost:3000/post/${postObject._id}`,
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
      case "most_likes":
        sortOptions = { likesCount: -1 };
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

export const toggleLikeComment = async (params: CommentLikeParams) => {
  try {
    connectToDatabase();

    const { commentId, userId, userHasAlreadyLiked, path } = params;

    let updateQuery = {};

    if (userHasAlreadyLiked) {
      updateQuery = { $pull: { likes: userId }, $inc: { likeCount: -1 } };
    } else {
      updateQuery = {
        $addToSet: { likes: userId },
        $inc: { likeCount: 1 },
      };
    }

    const comment = await Comment.findByIdAndUpdate(commentId, updateQuery, {
      new: true,
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // +2 reputation for liking a comment
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: userHasAlreadyLiked ? -2 : 2 },
    });

    // +10 reputation for receiving a like on a comment
    await User.findByIdAndUpdate(comment.author, {
      $inc: { reputation: userHasAlreadyLiked ? -10 : 10 },
    });

    const post = await Post.findById(comment.post);

    if (!userHasAlreadyLiked) {
      await knockClient.notify("new-comment-like", {
        actor: userId,
        recipients: [comment.author._id],
        data: {
          post: {
            title: post.title,
            link:
              process.env.NODE_ENV === "production"
                ? `${process.env.BASE_URL}/post/${post._id}`
                : `http://localhost:3000/post/${post._id}`,
          },
        },
      });
    }

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
