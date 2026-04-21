import {z} from "zod";

export const createPostDto = z.object({
    title: z.string().min(1, "Text is required").max(20, "Text is to big"),
    content: z.string().min(1, "Text is required").max(50, "Text is to big"),
})

