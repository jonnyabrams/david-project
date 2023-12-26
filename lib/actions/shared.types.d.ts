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
  picture: string | undefined;
  pdf: string | undefined;
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

export interface PostVoteParams {
  postId: string;
  userId: string;
  userHasUpvoted: boolean;
  userHasDownvoted: boolean;
  path: string;
}

export interface CommentVoteParams {
  commentId: string;
  userId: string;
  userHasUpvoted: boolean;
  userHasDownvoted: boolean;
  path: string;
}

export interface ToggleSavePostParams {
  userId: string;
  postId: string;
  path: string;
}

export interface GetSavedPostsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface ViewPostParams {
  postId: string;
  userId: string | undefined;
}

export interface GetPostsByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface DeletePostParams {
  postId: string;
  path: string;
}

export interface EditPostParams {
  postId: string;
  title: string;
  content: string;
  picture: string | undefined;
  pdf: string | undefined;
  path: string;
}

export interface DeleteCommentParams {
  commentId: string;
  path: string;
}
