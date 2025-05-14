import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

export class Auth {
    private auth = "secreto";
    
    public async authentication(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = req.headers.authorization;
        const role = req.headers['role-x-user'] as string;
        if (token && token === this.auth) {
            req.user = {
                id: randomUUID(),
                role
            }
            next();

        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
}