import { Schema, models, model, Document } from "mongoose";

import { IUser } from "./user.model";
import { IPost } from "./post.model";

export interface IComment extends Document {
  author: IUser | Schema.Types.ObjectId;
  post: IPost | Schema.Types.ObjectId;
  content: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// if it doesn't exist, create it
const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
