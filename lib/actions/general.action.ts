"use server";

import Post from "@/models/post.model";
import { connectToDatabase } from "../db";
import { SearchParams } from "./shared.types";
import User from "@/models/user.model";
import Comment from "@/models/comment.model";
import Tag from "@/models/tag.model";

const SearchableTypes = ["post", "comment", "user", "tag"];

export const globalSearch = async (params: SearchParams) => {
  try {
    await connectToDatabase();

    const { query, type } = params;

    const regexQuery = { $regex: query, $options: "i" };

    let results = [];

    const modelsAndTypes = [
      { model: Post, searchField: "title", type: "post" },
      { model: User, searchField: "fullName", type: "user" },
      { model: Comment, searchField: "content", type: "comment" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    // make type always lowercase
    const typeLowerCase = type?.toLowerCase();

    // if none of the filters have been turned on, search across everything
    if (!typeLowerCase || !SearchableTypes.includes(typeLowerCase)) {
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({
            [searchField]: regexQuery,
          })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "comment"
                ? `Comments containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "comment"
                  ? item.post
                  : item._id,
          }))
        );
      }
    } else {
      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);

      results = queryResults.map((item) => ({
        title:
          type === "comment"
            ? `Comments containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "comment"
              ? item.post
              : item._id,
      }));
    }

    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
