import { NextFunction, Request, Response } from "express";
import { Authorize } from "../http/authorization/Authorize";
import { HttpClient } from "../http/HttpClient";
import { UserLogged } from "../http/types/express";
import { Auth } from "../http/authentication/Auth";
import { GerarCestasUseCase } from "../../application/port/in/GerarCestasUseCase";
import { GerarCestasDTO } from "../../application/dto/GerarCestasDTO";
import { ActionType } from "../http/authorization/Permission";

export class CestasController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
        readonly gerarCestasUseCase: GerarCestasUseCase
    ) {
        httpClient.on(
            "post", 
            "/cestas/gerar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.GerarCesta),
            async function (params: any, data: GerarCestasDTO, userLogged?: UserLogged) {
                const output = await gerarCestasUseCase.execute(data);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );
    }
}