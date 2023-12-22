"use server";

import { connectToDatabase } from "../db";
import { ViewPostParams } from "./shared.types";
import Interaction from "@/models/interaction.model";
import Post from "@/models/post.model";

export const viewPost = async (params: ViewPostParams) => {
  try {
    await connectToDatabase();

    const { postId, userId } = params;

    // update view count for post
    await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });

    // check if user has already viewed that post before creating an interaction object
    // this is to avoid recommending posts to the user that they've already viewed
    if (userId) {
      const userHasViewed = await Interaction.findOne({
        user: userId,
        action: "view",
        post: postId,
      });

      if (userHasViewed)
        return console.log("User has already viewed this post");
    }

    await Interaction.create({
      user: userId,
      action: "view",
      post: postId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
