import * as z from "zod";

export const PostSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(130, { message: "Title must be a maximum of 130 characters" }),
  content: z.string().max(1000, { message: "Post cannot exceed 1000 characters" }),
  tags: z.array(z.string().min(1).max(30)).min(1).max(3),
});
