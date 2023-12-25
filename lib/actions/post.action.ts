"use server";

import { connectToDatabase } from "../db";
import Post from "@/models/post.model";
import Tag from "@/models/tag.model";
import User from "@/models/user.model";
import Comment from "@/models/comment.model";
import Interaction from "@/models/interaction.model";
import {
  CreatePostParams,
  DeletePostParams,
  EditPostParams,
  GetPostByIdParams,
  GetPostsParams,
  PostVoteParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";

export const getPosts = async (params: GetPostsParams) => {
  try {
    connectToDatabase();

    const posts = await Post.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { posts };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createPost = async (params: CreatePostParams) => {
  try {
    connectToDatabase();

    const { title, content, tags, author, picture, path } = params;

    const post = await Post.create({
      title,
      content,
      author,
      picture,
    });

    const tagDocuments = [];

    for (const tag of tags) {
      // create tags or get them if they already exist
      // this searches for document in Tag collection where the name matches the regex
      // if it finds one, it updates it by pushing the id of the post into the posts array
      // if no matching document is found, it inserts a new document with the name set to the value of the tag and adds the post id to the posts array
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(`^${tag.value}$`, "i"),
          },
        },
        { $setOnInsert: { name: tag.value }, $push: { posts: post._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    // for each tag document, push the id of that tag into the post's tags array
    await Post.findByIdAndUpdate(post._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path);
  } catch (error) {}
};

export const getPostById = async (params: GetPostByIdParams) => {
  try {
    connectToDatabase();

    const { postId } = params;

    const post = await Post.findById(postId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId salutation firstName lastName picture",
      });

    return post;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const upvotePost = async (params: PostVoteParams) => {
  try {
    connectToDatabase();

    const { postId, userId, userHasUpvoted, userHasDownvoted, path } = params;

    let updateQuery = {};

    if (userHasUpvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (userHasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const post = await Post.findByIdAndUpdate(postId, updateQuery, {
      new: true,
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const downvotePost = async (params: PostVoteParams) => {
  try {
    connectToDatabase();

    const { postId, userId, userHasUpvoted, userHasDownvoted, path } = params;

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

    const post = await Post.findByIdAndUpdate(postId, updateQuery, {
      new: true,
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deletePost = async (params: DeletePostParams) => {
  try {
    connectToDatabase();

    const { postId, path } = params;

    await Post.deleteOne({ _id: postId });

    // delete its comments and interactions too
    await Comment.deleteMany({ post: postId });
    await Interaction.deleteMany({ post: postId });

    // update tags to no longer include this post
    await Tag.updateMany({ posts: postId }, { $pull: { posts: postId } });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editPost = async (params: EditPostParams) => {
  try {
    connectToDatabase();

    const { postId, title, content, picture, path } = params;

    const post = await Post.findById(postId).populate("tags");

    if (!post) {
      throw new Error("Post not found");
    }

    post.title = title;
    post.content = content;
    post.picture = picture;

    await post.save();

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
