import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const authMiddleware= async (req: Request, res: Response, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Invalid Credentials" }); // проверяем есть ли вообще токен если есть то идет дальше проверить его
        }

        const parts = authHeader.split(" "); // тут мы делим токен на 2 части чтобы потом получить только сам токен jwt
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ message: "Invalid Credentials" }); // тут проверка если нету 2 елемента в объекте и тип авторизации то ошибка
        }

        const token = parts[1]; // тут мы берм сам jwt без title

        const decoded = jwt.verify( // тут мы проверяем токен на подлинность
            token,
            JWT_SECRET! // тут мы его просто сравниваем с помощью secret если не совпадает signnature тогда и сейчас то дальше не пропускает
        ) as { userId: string } // тут просто говорим что там есть объект такой

        (req as any).user = decoded; // потом просто мы decoded ложим в req чтобы потом его использовать

        next()

    } catch (e) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
}
