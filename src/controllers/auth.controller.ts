import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import {AuthService} from "@/services/auth.service";
import {authDto} from "@/validators/auth.dto";

const router = Router();

const authService = new AuthService();

router.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validation = await authDto.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json(validation.error.issues);
        }

        const resultRegister = await authService.register(validation.data);

        res.status(200).json(resultRegister);
    } catch (e) {
        next(e);
    }
})

router.post("/api/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validation = await authDto.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json(validation.error.issues);
        }

        const resultLogin = await authService.login(validation.data)
        res.status(200).json(resultLogin);
    } catch (e) {
        next(e);
    }
})

export const authRouter = router
