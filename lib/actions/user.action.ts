"use server";

import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";

import { connectToDatabase } from "../db";
import User from "@/models/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  FollowUserParams,
  GetFollowsParams,
  GetAllUsersParams,
  GetSavedPostsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSavePostParams,
  UpdateUserParams,
} from "./shared.types";
import Post, { IPost } from "@/models/post.model";
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

    const { searchQuery, filter, page = 1, limit = 20 } = params;

    // calculate number of users to skip based on page number and page size
    const skipAmount = (page - 1) * limit;

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

    const users = await User.find(query)
      .skip(skipAmount)
      .limit(limit)
      .sort(sortOptions);

    const totalUsers = await User.countDocuments(query);

    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFollows = async (params: GetFollowsParams) => {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, limit = 20, userId, type } = params;

    // calculate number of users to skip based on page number and page size
    const skipAmount = (page - 1) * limit;

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

    const user = await User.findById(userId).populate({
      path: type,
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit,
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const follows = type === "followers" ? user.followers : user.following

    const totalPages = Math.ceil(follows.length / limit);
    const isLastPage = page >= totalPages;

    const isNext = !isLastPage && follows.length > limit;

    return { follows, isNext };
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

    const { clerkId, searchQuery, filter, page = 1, limit = 20 } = params;

    // calculate number of users to skip based on page number and page size
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
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_likes":
        sortOptions = { likes: -1 };
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
        skip: skipAmount,
        limit,
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

    // handles edge cases where isNext was true when it should have been false
    const originalUser = await User.findOne({ clerkId });
    const totalSavedPosts = searchQuery
      ? originalUser.savedPosts.filter(
          (post: IPost) =>
            (post.title && post.title.match(new RegExp(searchQuery, "i"))) ||
            (post.content && post.content.match(new RegExp(searchQuery, "i")))
        ).length
      : originalUser.savedPosts.length;

    const totalPages = Math.ceil(totalSavedPosts / limit);
    const isLastPage = page >= totalPages;

    const isNext = !isLastPage && totalSavedPosts > limit;

    const savedPosts = user.savedPosts;

    return { posts: savedPosts, isNext };
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
    const totalFollowers = user.followers.length;
    const totalFollowing = user.following.length;

    return { user, totalPosts, totalComments, totalFollowers, totalFollowing };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserPosts = async (params: GetUserStatsParams) => {
  try {
    connectToDatabase();

    const { userId, page = 1, limit = 10 } = params;

    const skipAmount = (page - 1) * limit;

    const totalPosts = await Post.countDocuments({ author: userId });

    const userPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1, views: -1, likes: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId salutation firstName surname picture");

    const isNext = totalPosts > skipAmount + userPosts.length;

    return { totalPosts, posts: userPosts, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserComments = async (params: GetUserStatsParams) => {
  try {
    connectToDatabase();

    const { userId, page = 1, limit = 10 } = params;

    const skipAmount = (page - 1) * limit;

    const totalComments = await Comment.countDocuments({ author: userId });

    const userComments = await Comment.find({ author: userId })
      .sort({ likes: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate("post", "_id title")
      .populate("author", "_id clerkId salutation firstName surname picture");

    const isNext = totalComments > skipAmount + userComments.length;

    return { totalComments, comments: userComments, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const followUser = async (params: FollowUserParams) => {
  try {
    connectToDatabase();

    const { followingUserId, followedUserId, userAlreadyFollows, path } =
      params;

    const followingUser = await User.findOne({ clerkId: followingUserId });
    const followedUser = await User.findOne({ clerkId: followedUserId });

    let followingUserUpdateQuery = {};

    let followedUserUpdateQuery = {};

    if (userAlreadyFollows) {
      followingUserUpdateQuery = {
        $pull: { following: followedUser._id },
        $inc: { followingCount: -1, reputation: -2 },
      };
      followedUserUpdateQuery = {
        $pull: { followers: followingUser._id },
        $inc: { followerCount: -1, reputation: -10 },
      };
    } else {
      followingUserUpdateQuery = {
        $addToSet: { following: followedUser._id },
        $inc: { followingCount: 1, reputation: 2 },
      };
      followedUserUpdateQuery = {
        $addToSet: { followers: followingUser._id },
        $inc: { followerCount: 1, reputation: 10 },
      };
    }

    await User.findByIdAndUpdate(followingUser._id, followingUserUpdateQuery, {
      new: true,
    });

    if (!followingUser) {
      throw new Error("Following user not found");
    }

    await User.findByIdAndUpdate(followedUser._id, followedUserUpdateQuery, {
      new: true,
    });

    if (!followedUser) {
      throw new Error("Followed user not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
