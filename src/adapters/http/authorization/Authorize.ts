import { NextFunction, Request, Response } from "express";
import { Action, AppAbility, defineAbilityFor } from "./Permission";

export class Authorize {
    private readonly appAbility: AppAbility;

    constructor() {
        this.appAbility = defineAbilityFor();
    }
    
    public async can(req: Request, res: Response, next: NextFunction): Promise<void> {
        const action = "manager" as Action;
        const result = this.appAbility.can(action, { role: 'App', __caslSubjectType__: 'payload'});
        if (result) {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
}