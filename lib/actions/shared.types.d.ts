import { Schema } from "mongoose";

import { IUser } from "@/models/user.model";

export interface GetPostsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface CreatePostParams {
  title: string;
  content: string;
  tags: { label: string; value: string }[];
  author: Schema.Types.ObjectId | IUser;
  path;
}