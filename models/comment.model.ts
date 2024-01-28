import { Schema, models, model, Document } from "mongoose";

import { IUser } from "./user.model";
import { IPost } from "./post.model";

export interface IComment extends Document {
  author: IUser | Schema.Types.ObjectId;
  post: IPost | Schema.Types.ObjectId;
  content: string;
  likes: Schema.Types.ObjectId[];
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// if it doesn't exist, create it
const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
