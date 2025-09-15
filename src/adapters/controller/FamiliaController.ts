import { NextFunction, Request, Response } from "express";
import { Auth } from "../http/authentication/Auth";
import { Authorize } from "../http/authorization/Authorize";
import { HttpClient } from "../http/HttpClient";
import { ActionType } from "../http/authorization/Permission";
import { CadastrarFamiliaDTO } from "../../application/dto/CadastrarFamiliaDTO";
import { ConsultarFamiliaUseCase } from "../../application/port/in/ConsultarFamiliaUseCase";
import { UserLogged } from "../http/types/express";
import { AuditProxy } from "../../application/port/in/AuditProxy";

export class FamiliaController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
        readonly auditProxy: AuditProxy<CadastrarFamiliaDTO, any>,
        readonly consultarFamiliaUseCase: ConsultarFamiliaUseCase
    ) {

        httpClient.on(
            "post", 
            "/familia/cadastrar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.CadastrarFamilia),
            async function (params: any, data: CadastrarFamiliaDTO, userLogged?: UserLogged) {
                const output = await auditProxy.execute(data, ActionType.CadastrarFamilia, userLogged!);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );

        httpClient.on(
            "get", 
            "/dificuldade/listar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarDificuldade),
            async function (_params: any, _data: any) {
                const output = await consultarFamiliaUseCase.listarDificuldades();
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: output
                };
            }
        );
    }
}