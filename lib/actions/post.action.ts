"use server";

import { connectToDatabase } from "../db";
import Post from "@/models/post.model";
import Tag from "@/models/tag.model";
import User from "@/models/user.model";
import {
  CreatePostParams,
  GetPostByIdParams,
  GetPostsParams,
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

    const { title, content, tags, author, path } = params;

    const post = await Post.create({
      title,
      content,
      author,
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
        { $setOnInsert: { name: tag.value }, $push: { post: post._id } },
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
