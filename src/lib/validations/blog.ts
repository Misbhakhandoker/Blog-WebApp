import { z } from "zod";

export const BlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  image: z.object({
    url: z.string().url("Invalid image URL"),
    alt: z.string().optional().default(""),
  }),
  tag: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});
