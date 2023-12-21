"use server";

import { revalidatePath } from "next/cache";

import Comment from "@/models/comment.model";
import { connectToDatabase } from "../db";
import { CreateCommentParams, GetCommentsParams } from "./shared.types";
import Post from "@/models/post.model";

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
    await Post.findByIdAndUpdate(post, { $push: { comments: newComment._id } });

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

    const { postId } = params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "_id clerkId salutation firstName surname picture")
      .sort({ createdAt: -1 });

    return { comments };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
