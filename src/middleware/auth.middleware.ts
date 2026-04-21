import type { Request, Response, NextFunction } from "express";

export const authMiddleware= async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next()
}
