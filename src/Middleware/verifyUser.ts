import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include `user`
interface CustomRequest extends Request {
    user?: { id: string };
}

export const verifyUser = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        if (!decoded || !decoded.id) {
            res.status(401).json({ error: 'Invalid token.' });
            return;
        }

        req.user = { id: decoded.id }; // Attach user ID to request
        next(); // Pass control to the next middleware or route handler
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};