import { Schema } from "mongoose";

import { IUser } from "@/models/user.model";

export interface GetPostsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface GetPostByIdParams {
  postId: string;
}

export interface CreatePostParams {
  title: string;
  content: string;
  tags: { label: string; value: string }[];
  author: Schema.Types.ObjectId | IUser;
  path;
}

export interface CreateUserParams {
  clerkId: string;
  email: string;
}

export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

export interface DeleteUserParams {
  clerkId: string;
}

export interface GetUserByIdParams {
  userId: string;
}

export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetTopTagsForUserParams {
  userId: string;
  limit?: number;
}

export interface CreateCommentParams {
  content: string;
  author: string; // user id
  post: string; // post id
  path: string;
}

export interface GetCommentsParams {
  postId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}