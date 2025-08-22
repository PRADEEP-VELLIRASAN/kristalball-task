import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err) => {
        if (err) return res.sendStatus(403);
        next();
    });
};

export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['authorization']?.split(' ')[1];
        
        if (!token) return res.sendStatus(401);

        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.sendStatus(403);
            if (!roles.includes(user.role)) return res.sendStatus(403);
            next();
        });
    };
};