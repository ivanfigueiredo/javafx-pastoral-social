import { NextFunction, Request, Response } from "express";
import { Auth } from "../http/authentication/Auth";
import { Authorize } from "../http/authorization/Authorize";
import { HttpClient } from "../http/HttpClient";
import { ActionType } from "../http/authorization/Permission";
import { CadastrarFamiliaDTO } from "../../application/dto/CadastrarFamiliaDTO";
import { FamiliaUseCase } from "../../application/port/in/FamiliaUseCase";

export class FamiliaController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
        readonly familiaUseCase: FamiliaUseCase
    ) {

        httpClient.on(
            "post", 
            "/familia/cadastrar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.CadastrarFamilia),
            async function (params: any, data: CadastrarFamiliaDTO) {
                const output = await familiaUseCase.cadastrar(data);
                return output;
            }
        );

        httpClient.on(
            "get", 
            "/dificuldade/listar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarDificuldade),
            async function (params: any, data: any) {
                const output = await familiaUseCase.listarDificuldades();
                return output;
            }
        );
    }
}