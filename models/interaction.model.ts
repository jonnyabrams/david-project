import { Schema, models, model, Document } from "mongoose";

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId;
  action: string;
  post: Schema.Types.ObjectId;
  comment: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const InteractionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: Schema.Types.ObjectId, ref: "Comment" },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true }
);

// if it doesn't exist, create it
const Interaction =
  models.Interaction || model("Interaction", InteractionSchema);

export default Interaction;
