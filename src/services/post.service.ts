import {Post} from "@/generated/prisma/client";
import { prisma } from "@/client";

export class PostService {
    prisma = prisma;

    async createPost(post: ICreatePost): Promise<Post> {
        try {
            return await this.prisma.post.create({
                data: post
            })
        } catch (error) {
            throw new Error('Error creating post');
        }
    }

    async getPosts(): Promise<Post[]> {
        try {
            return this.prisma.post.findMany()
        } catch (error) {
            throw new Error('Error getting posts');
        }
    }
}
