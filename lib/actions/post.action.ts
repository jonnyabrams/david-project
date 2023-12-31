"use server";

import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";

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

export const getPosts = async (params: GetPostsParams) => {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, limit = 20 } = params;

    // calculate number of posts to skip based on page number and page size
    const skipAmount = (page - 1) * limit;

    // initialize an empty query object
    const query: FilterQuery<typeof Post> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_upvoted":
        sortOptions = { upvoteCount: -1 };
        break;
      case "most_comments":
        sortOptions = { commentCount: -1 };
        break;
      default:
        break;
    }

    const posts = await Post.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(limit)
      .sort(sortOptions);

    const totalPosts = await Post.countDocuments(query);

    const isNext = totalPosts > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createPost = async (params: CreatePostParams) => {
  try {
    connectToDatabase();

    const { title, content, tags, author, picture, pdf, path } = params;

    const post = await Post.create({
      title,
      content,
      author,
      picture,
      pdf,
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
        {
          $setOnInsert: { name: tag.value },
          $push: { posts: post._id },
          $inc: { postCount: 1 },
        },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    // for each tag document, push the id of that tag into the post's tags array
    await Post.findByIdAndUpdate(post._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    await Interaction.create({
      user: author,
      action: "create_post",
      post: post._id,
      tags: tagDocuments,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
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
        select: "_id clerkId salutation firstName surname picture pdf",
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

    const post = await Post.findByIdAndUpdate(postId, updateQuery, {
      new: true,
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // +1 reputation for giving an upvote
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: userHasUpvoted ? -1 : 1 },
    });

    // +10 reputation for receiving an upvote
    await User.findByIdAndUpdate(post.author, {
      $inc: { reputation: userHasUpvoted ? -10 : 10 },
    });

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
      updateQuery = {
        $pull: { downvotes: userId },
        $inc: { downvoteCount: -1 },
      };
    } else if (userHasUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
        $inc: { upvoteCount: -1, downvoteCount: 1 },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
        $inc: { downvoteCount: 1 },
      };
    }

    const post = await Post.findByIdAndUpdate(postId, updateQuery, {
      new: true,
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // -10 reputation for receiving a downvote
    await User.findByIdAndUpdate(post.author, {
      $inc: { reputation: userHasDownvoted ? 10 : -10 },
    });

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
    await Tag.updateMany(
      { posts: postId },
      { $pull: { posts: postId }, $inc: { postCount: -1 } }
    );

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editPost = async (params: EditPostParams) => {
  try {
    connectToDatabase();

    const { postId, title, content, picture, pdf, path } = params;

    const post = await Post.findById(postId).populate("tags");

    if (!post) {
      throw new Error("Post not found");
    }

    post.title = title;
    post.content = content;
    post.picture = picture;
    post.pdf = pdf;

    await post.save();

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTopPosts = async () => {
  try {
    connectToDatabase();

    const topPosts = await Post.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return topPosts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
