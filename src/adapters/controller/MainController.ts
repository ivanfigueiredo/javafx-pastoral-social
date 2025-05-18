import { NextFunction, Request, Response } from "express";
import { HttpClient } from "../http/HttpClient";
import { AuthUseCase } from "../../application/port/in/AuthUseCase";
import { LoginDTO } from "../../application/dto/LoginDTO";
import { RefreshTokenDTO } from "../../application/dto/RefreshTokenDTO";

export class MainController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: AuthUseCase
    ) {
        httpClient.on(
            "post", 
            "/security/login", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (params: any, data: LoginDTO) {
                const output = await auth.login(data);
                return output;
            }
        );

        httpClient.on(
            "post", 
            "/security/refresh/token", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (params: any, data: RefreshTokenDTO) {
                const output = await auth.refreshToken(data);
                return output;
            }
        );
    }
}