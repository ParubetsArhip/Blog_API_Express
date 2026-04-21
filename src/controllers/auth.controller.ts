import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import {AuthService} from "@/services/auth.service";

const router = Router();

const authService = new AuthService();

router.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {

})
