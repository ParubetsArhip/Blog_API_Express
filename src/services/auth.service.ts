import "dotenv/config";
import { prisma } from "@/client";
import {User} from "@/generated/prisma/client";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export class AuthService {
    prisma = prisma

    async register(auth: Auth): Promise<User | any> {
        const { email, password } = auth;

        const exisingUser = await this.prisma.user.findUnique({ // Найди одного пользователя по уникальному полю email // найди строку, где email = "test@mail.com" // ищет пользователя в базе по уникальному полю
            where: { email } // Найди запись, которая соответствует этому условию
        })

        if (exisingUser) {
            throw new Error("User already exist"); // Если пользователь уже есть — останови регистрацию
        }

        const hashedPassword = await bcrypt.hash(password, 10) // превращает пароль в безопасный хеш 10 = уровень сложности

        return this.prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })
    }

    async login (auth: Auth): Promise<User | any> {
        const { email, password } = auth;

        const exisingUser = await this.prisma.user.findUnique({ // берем одного человека данные почты
            where: { email }
        })

        if (!exisingUser) {
            throw new Error("Invalid credentials"); // если нету такой почты то пишеться неверные данные
        }

        const isMatch = await bcrypt.compare(password, exisingUser.password) // тут сравниваться пароль настоящий и хешированный

        if (!isMatch) {
            throw new Error("Invalid credentials"); // если пароли не совпадают то тоже самое неверные данные
        }

        const token = jwt.sign( // тут мы создаем jwt токен если человек входит то ему даеться токен на 1 день
            {userId: exisingUser.id},
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        )

        return { token }
    }
}



// Почему НЕ data
//
// Потому что data = для записи (create/update)
//
// Разница очень важная
// Ключ	Значение	Где используется
// where	найти	find / delete / update
// data	создать или изменить	create / update



// 3. update → оба
// update({
//     where: { id: "123" },
//     data: { email: "new@mail.com" }
// })
//
// 👉 “найди и обнови”





// request
//   ↓
// validation (Zod)
//   ↓
// business logic (service)
//   ↓
// bcrypt hash
//   ↓
// Prisma save
//   ↓
// response





// ---------------------


// REGISTER
// → bcrypt.hash
// → save to DB
//
// LOGIN
// → prisma.findUnique
// → bcrypt.compare
// → jwt.sign
//
// REQUEST
// → Authorization header
//
// MIDDLEWARE
// → jwt.verify
// → доступ к userId


// ----------------

// jwt.sign → создаёт токен
// payload → данные (userId)
// SECRET → защита от подделки
//     .env → безопасное хранение секрета


// user.id  → ID из базы
// userId   → имя поля в токене
// payload  → объект данных внутри JWT

// JWT_SECRET = защита токена
// expiresIn = срок жизни токена




