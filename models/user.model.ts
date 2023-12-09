import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  salutation: string;
  firstName: string;
  surname: string;
  email: string;
  password?: string;
  bio?: string;
  trust?: string;
  specialty?: string;
  subSpecialty?: string;
  picture: string;
  location?: string;
  website?: string;
  reputation?: number;
  savedPosts: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true },
    salutation: { type: String, required: true },
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    picture: { type: String, required: true },
    location: { type: String },
    website: { type: String },
    reputation: { type: Number, default: 0 },
    savedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

// if it doesn't exist, create it
const User = models.User || model("User", UserSchema);

export default User;
