import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  salutation?: string;
  firstName?: string;
  surname?: string;
  fullName?: string;
  email: string;
  password?: string;
  bio?: string;
  trust?: string;
  specialty?: string;
  subSpecialty?: string;
  picture?: string;
  location?: string;
  website?: string;
  reputation?: number;
  savedPosts?: Schema.Types.ObjectId[];
  followers?: Schema.Types.ObjectId[];
  following?: Schema.Types.ObjectId[];
  followerCount: number;
  followingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    salutation: { type: String },
    firstName: { type: String },
    surname: { type: String },
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    trust: { type: String },
    specialty: { type: String },
    subspecialty: { type: String },
    password: { type: String },
    bio: { type: String },
    picture: { type: String },
    location: { type: String },
    website: { type: String },
    reputation: { type: Number, default: 0 },
    savedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    isOnboarded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// if it doesn't exist, create it
const User = models.User || model("User", UserSchema);

export default User;
