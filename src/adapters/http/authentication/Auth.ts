import { NextFunction, Request, Response } from "express";

export class Auth {
    private auth = "secreto";
    
    public async authentication(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = req.headers.authorization;
        if (token && token === this.auth) {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
}