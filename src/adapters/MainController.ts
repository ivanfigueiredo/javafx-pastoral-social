import { NextFunction, Request, Response } from "express";
import { HttpClient } from "./http/HttpClient";
import { Auth } from "./http/authentication/Auth";
import { Authorize } from "./http/authorization/Authorize";
import { ActionType } from "./http/authorization/Permission";

export class MainController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
    ) {
        httpClient.on(
            "post", 
            "/create-user", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.AprovarEntrega),
            async function (params: any, data: any) {
                const output = {OK:true};
                return output;
            }
        );
    }
}