"use server";

import { FilterQuery } from "mongoose";

import User from "@/models/user.model";
import { connectToDatabase } from "../db";
import {
  GetAllTagsParams,
  GetPostsByTagIdParams,
  GetTopTagsForUserParams,
} from "./shared.types";
import Tag, { ITag } from "@/models/tag.model";
import Post, { IPost } from "@/models/post.model";

export const getTopTagsForUser = async (params: GetTopTagsForUserParams) => {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // Find user interactions and group by tags

    return [
      { _id: "1", name: "tag 1" },
      { _id: "2", name: "tag 2" },
      { _id: "3", name: "tag 3" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, limit = 20 } = params;

    const skipAmount = (page - 1) * limit;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { postCount: -1 };
        break;
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "alphabetical":
        sortOptions = { name: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(limit);

    const totalTags = await Tag.countDocuments(query);

    const isNext = totalTags > skipAmount + tags.length;
    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPostsByTagId = async (params: GetPostsByTagIdParams) => {
  try {
    connectToDatabase();

    const { tagId, page = 1, limit = 20, searchQuery } = params;

    const skipAmount = (page - 1) * limit;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "posts",
      model: Post,
      match: searchQuery
        ? {
            $or: [
              { title: { $regex: searchQuery, $options: "i" } },
              { content: { $regex: searchQuery, $options: "i" } },
            ],
          }
        : {},
      options: {
        sort: { createdAt: -1 },
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

    if (!tag) {
      throw new Error("Tag not found");
    }

    // handles edge cases where isNext was true when it should have been false
    const originalTag = await Tag.findById(tagId);
    const totalTagPosts = searchQuery
      ? originalTag.posts.filter(
          (post: IPost) =>
            (post.title && post.title.match(new RegExp(searchQuery, "i"))) ||
            (post.content && post.content.match(new RegExp(searchQuery, "i")))
        ).length
      : originalTag.posts.length;
    const totalPages = Math.ceil(totalTagPosts / limit);
    const isLastPage = page >= totalPages;

    const isNext = !isLastPage && originalTag.posts.length > limit;

    const posts = tag.posts;

    return { tagTitle: tag.name, posts, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPopularTags = async () => {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      {
        // this returns us the tag name and a numberOfPosts property that's the size of the posts array
        $project: { name: 1, numberOfPosts: { $size: "$posts" } },
      },
      { $sort: { numberOfPosts: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
