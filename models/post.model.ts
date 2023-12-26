import { Schema, models, model, Document } from "mongoose";
import { IUser } from "./user.model";

export interface IPost extends Document {
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: IUser | Schema.Types.ObjectId;
  comments: Schema.Types.ObjectId[];
  picture: string;
  pdf: { name: string; url: string };
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    picture: { type: String },
    pdf: {
      name: { type: String },
      url: { type: String },
    },
  },
  { timestamps: true }
);

// if it doesn't exist, create it
const Post = models.Post || model("Post", PostSchema);

export default Post;
