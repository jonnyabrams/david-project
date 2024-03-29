import { Schema } from "mongoose";

import { IUser } from "@/models/user.model";

export interface GetPostsParams {
  page?: number;
  limit?: number;
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
  pdf: { name: string; url: string } | undefined;
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
  userId: string | null;
}

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  filter?: string;
  searchQuery?: string;
}
export interface GetFollowsParams {
  page?: number;
  limit?: number;
  filter?: string;
  searchQuery?: string;
  userId: string;
  type: string;
}

export interface GetAllTagsParams {
  page?: number;
  limit?: number;
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
  filter?: string;
  page?: number;
  limit?: number;
}

export interface PostLikeParams {
  postId: string;
  userId: string;
  userHasAlreadyLiked: boolean;
  path: string;
}

export interface CommentLikeParams {
  commentId: string;
  userId: string;
  userHasAlreadyLiked: boolean;
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
  limit?: number;
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
  limit?: number;
  searchQuery?: string;
}

export interface GetUserStatsParams {
  profileUserId: string;
  page?: number;
  limit?: number;
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
  pdf: { name: string; url: string } | undefined;
  path: string;
}

export interface DeleteCommentParams {
  commentId: string;
  path: string;
}

export interface SearchParams {
  query?: string | null;
  type?: string | null;
}

export interface FollowUserParams {
  followingUserId: string;
  followedUserId: string;
  userAlreadyFollows: boolean;
  path: string;
}

export interface ReportPostEmailParams {
  postTitle: string;
  postId: string;
  userName: string;
  userEmail: string;
}