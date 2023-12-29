"use server";

import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";

import { connectToDatabase } from "../db";
import User from "@/models/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedPostsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSavePostParams,
  UpdateUserParams,
} from "./shared.types";
import Post from "@/models/post.model";
import Tag from "@/models/tag.model";
import Comment from "@/models/comment.model";

export const getUserById = async (params: GetUserByIdParams) => {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createUser = async (userData: CreateUserParams) => {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUser = async (params: UpdateUserParams) => {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete user's posts
    // const userPostIds = await Post.find({ author: user._id }).distinct("_id");

    await Post.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    connectToDatabase();

    const { searchQuery, filter } = params;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      const searchTerms = searchQuery.split(/\s+/).filter(Boolean);

      query.$and = searchTerms.map((term) => ({
        $or: [
          { salutation: { $regex: new RegExp(term, "i") } },
          { firstName: { $regex: new RegExp(term, "i") } },
          { surname: { $regex: new RegExp(term, "i") } },
          { trust: { $regex: new RegExp(term, "i") } },
          { specialty: { $regex: new RegExp(term, "i") } },
          { subspecialty: { $regex: new RegExp(term, "i") } },
        ],
      }));
    }

    let sortOptions = {};

    switch (filter) {
      case "recommended":
        sortOptions = {};
        break;
      case "new_users":
        sortOptions = { createdAt: -1 };
        break;
      case "old_users":
        sortOptions = { createdAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    const users = await User.find(query).sort(sortOptions);

    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const toggleSavePost = async (params: ToggleSavePostParams) => {
  try {
    connectToDatabase();

    const { userId, postId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isPostAlreadySaved = user.savedPosts.includes(postId);

    if (isPostAlreadySaved) {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { savedPosts: postId },
        },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { savedPosts: postId },
        },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSavedPosts = async (params: GetSavedPostsParams) => {
  try {
    connectToDatabase();

    const { clerkId, searchQuery, filter } = params;

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
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_upvoted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_comments":
        sortOptions = { comments: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "savedPosts",
      match: query,
      options: {
        sort: sortOptions,
      },
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
        {
          path: "author",
          model: User,
          select: "_id clerkId salutation firstName surname picture",
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedPosts = user.savedPosts;

    return { posts: savedPosts };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserInfo = async (params: GetUserByIdParams) => {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalPosts = await Post.countDocuments({ author: user._id });
    const totalComments = await Comment.countDocuments({ author: user._id });

    return { user, totalPosts, totalComments };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserPosts = async (params: GetUserStatsParams) => {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalPosts = await Post.countDocuments({ author: userId });

    const userPosts = await Post.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId salutation firstName surname picture");

    return { totalPosts, posts: userPosts };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserComments = async (params: GetUserStatsParams) => {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalComments = await Comment.countDocuments({ author: userId });

    const userComments = await Comment.find({ author: userId })
      .sort({ upvotes: -1 })
      .populate("post", "_id title")
      .populate("author", "_id clerkId salutation firstName surname picture");

    return { totalComments, comments: userComments };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
