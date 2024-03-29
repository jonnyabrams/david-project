import * as z from "zod";

export const PostSchema = z.object({
  title: z
    .string()
    .max(100, { message: "Title must not exceed 100 characters" }),
  content: z
    .string()
    .max(3000, { message: "Post cannot exceed 3000 characters" }),
  picture: z.string().url().optional().or(z.literal("")),
  pdf: z
    .object({
      name: z.string(),
      url: z.string(),
    })
    .optional(),
  tags: z
    .array(
      z.object({
        value: z.string().min(1).max(30),
        label: z.string().min(1).max(30),
      })
    )
    .max(3),
});

export const CommentSchema = z.object({
  content: z
    .string()
    .max(3000, { message: "Comment cannot exceed 3000 characters" }),
});

export const ProfileSchema = z.object({
  salutation: z.string(),
  firstName: z.string().max(50),
  surname: z.string().max(50),
  website: z.string().url().optional().or(z.literal("")),
  picture: z.string().url().optional().or(z.literal("")),
  location: z.string().max(50).optional().or(z.literal("")),
  trust: z.string().max(100),
  specialty: z.string().max(50),
  subspecialty: z.string().max(50).optional().or(z.literal("")),
  bio: z.string().max(500).optional().or(z.literal("")),
});
