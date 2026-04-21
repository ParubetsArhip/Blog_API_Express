import { prisma } from "@/client";
import {User} from "@/generated/prisma/client";

export class AuthService {
    prisma = prisma

    async register(auth: Auth): Promise<User | any> {
        try {
            return await this.prisma.user.create({
                data: auth
            })
        } catch (error) {
            throw new Error("Unable to create auth request");
        }
    }
}

