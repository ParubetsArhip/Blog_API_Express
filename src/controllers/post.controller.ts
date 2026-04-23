import {Router} from "express";
import type { Request, Response } from "express";
import {createPostDto} from "@/validators/post.dto";
import {PostService} from "@/services/post.service";
import {authMiddleware} from "@/middleware/auth.middleware";

const router = Router();

const postService = new PostService

router.post("/api/create-post", authMiddleware, async (req: Request, res: Response) => {
    const validation = createPostDto.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.error.issues });
    }

    // мы достаём ID текущего авторизованного пользователя
    const userId = (req as any).user.userId;

    // ...validation.data = взять title и content
    // userId = добавить пользователя
    const post = await postService.createPost({
        ...validation.data,
        userId
    })

    return res.status(201).json({
        message: "Post successfully created",
        post
    });
})

router.get("/api/my-posts", authMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    const posts = await postService.getPosts(userId)
    return res.status(200).json(posts);
})

export const postRouter = router;
