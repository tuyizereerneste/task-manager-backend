import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include `user`
interface CustomRequest extends Request {
    user?: { id: string; role: string };
}

export const verifyAdmin = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.header("x-auth-token");
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }

    try {
        // Decode the token and ensure it has `id` and `role`
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };

        // Check if the role is specifically "USER"
        if (!decoded || decoded.role !== "ADMIN") {
            res.status(403).json({ error: "Access denied. Users only." });
            return;
        }

        // Attach the user info to the request object
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ error: "Invalid token." });
    }
};