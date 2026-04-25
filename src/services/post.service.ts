import {Post} from "@/generated/prisma/client";
import { prisma } from "@/client";

export class PostService {
    prisma = prisma;

    async createPost(post: ICreatePost): Promise<Post> {
        try {
            return this.prisma.post.create({ // создаем пост и сохраняем его в бд
                data: {
                    title: post.title,
                    content: post.content,
                    authorId: post.userId // а это привязывает человека к этому посту то есть только он его сделал и все
                }
            })
        } catch (error) {
            throw new Error('Error creating post');
        }
    }

    async getPosts(userId: string): Promise<Post[]> {
        try {
            return this.prisma.post.findMany({ // тут мы уже берем все посты одно человека
                where: {
                    authorId: userId // тут мы берем только те посты, где автор этот пользователь
                }
            })
        } catch (error) {
            throw new Error('Error getting posts');
        }
    }

    async deletePost(postId: string, userId: string): Promise<Post> {
        try {
            const post = await this.prisma.post.findUnique({ // тут мы берем пост, который написал пользователь
                where: { id: postId}
            })

            if (!post) {
                throw new Error('No post found.'); // проверяем есть ли такой пост вообще
            }

            if (post.authorId !== userId) {
                throw new Error('Cannot delete post.'); // проверяем принадлежит ли этот пост данному человеку
            }

                return await this.prisma.post.delete({ // удаляем этот пост
                where: { id: postId }
            })
        } catch (error) {
            throw new Error('Error deleting post');
        }
    }
}








// ⚡ Вся логика в одной цепочке
// найти пост
// проверить существует ли
// проверить владельца
// если не совпадает — запрет
// если совпадает — удалить
// вернуть результат


// 1. взять postId из req.params
// 2. взять userId из JWT (authMiddleware)
// 3. проверить что пост принадлежит userId
// 4. удалить





// 🧠 Откуда приходит userId
// login → создаётся JWT
// middleware → достаёт userId
// controller → передаёт в service





/*
🔗 Самое важное место
authorId: post.userId
🧠 Что это значит

👉 ты берёшь:

    userId (из JWT)

и записываешь его как:

    authorId (в базе)
🔥 Почему это критично
это связывает пост с пользователем
📊 Что происходит в реальности
1. Пользователь логинится
JWT → { userId: "123" }
2. Делает запрос
POST /create-post
3. Middleware
req.user = { userId: "123" }
4. Controller
userId = req.user.userId
5. Service
authorId = userId*/


