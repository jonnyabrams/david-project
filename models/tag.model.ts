import { Schema, models, model, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  description: string;
  posts: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  postCount: number;
  followerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    postCount: { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// if it doesn't exist in the db, create it
const Tag = models.Tag || model("Tag", TagSchema);

export default Tag;
