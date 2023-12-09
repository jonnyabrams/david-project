import { Schema, models, model, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  description: string;
  posts: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// if it doesn't exist, create it
const Tag = models.Tag || model("Tag", TagSchema);

export default Tag;
