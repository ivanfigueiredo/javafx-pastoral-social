import { NextFunction, Request, Response } from "express";
import { Action, AppAbility, Role } from "./Permission";

export class Authorize {
    constructor(readonly appAbility: AppAbility) {}
    
    public async can(req: Request, res: Response, next: NextFunction, action: Action): Promise<void> {
        const result = this.appAbility.can(action, { role: req.user?.role as Role, __caslSubjectType__: 'RolePermission'});
        if (result) {
            next();
        } else {
            res.status(403).json({ message: "Não autorizado." });
        }
    }
}