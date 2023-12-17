"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../db";
import { GetAllTagsParams, GetTopTagsForUserParams } from "./shared.types";
import Tag from "@/models/tag.model";

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

    const tags = await Tag.find({});

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
