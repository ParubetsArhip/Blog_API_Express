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

router.delete("/api/delete/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    const postId = req.params.id; // берем id поста который надо удалить
    const userId = (req as any).user.userId; // берем id человека, который делает запрос

    const result = await postService.deletePost(postId, userId)

    return res.status(200).json({
        message: "Post successfully deleted",
        result
    });
})

export const postRouter = router;





// 1. клиент → DELETE /api/delete/123
// 2. middleware проверяет JWT
// 3. достаёт userId
// 4. берёт postId из URL
// 5. отправляет в service
// 6. service проверяет:
//     - есть ли пост
// - принадлежит ли userId
// 7. если да → удаляет
// 8. возвращает ответ
