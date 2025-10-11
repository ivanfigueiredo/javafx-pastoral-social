import { NextFunction, Request, Response } from "express";
import { AuthQuery } from "./AuthQuery";

export class Auth {
    constructor(private readonly authQuery: AuthQuery) {}
    
    public async authentication(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bearerToken = req.headers.authorization;
        const token = bearerToken?.split(" ")[1];
        const response = {
            timestamp: new Date().toISOString(),
            message: 'Não Autorizado',
            path: req.path
        }
        if (token) {
            const security = await this.authQuery.authentication(token);
            if (!security || this.isAccessTokenExpired(security.expiresAt) || security.revoked) {
                res.status(401).json(response);
                return;
            }
            const userInfo = await this.authQuery.userInfo(security.userId);
            req.user = {
                userId: security.userId,
                nickName: userInfo!.nickName,
                nome: userInfo!.nome,
                role: security.role
            }
            next();
        } else {
            res.status(401).json(response);
        }
    }

    private isAccessTokenExpired(expiresAt: Date): boolean {
        return expiresAt.getTime() < Date.now();
    }
}