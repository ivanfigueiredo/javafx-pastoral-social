import { NextFunction, Response, Request } from "express";
import { TemplateUseCase } from "../../application/port/in/TemplateUseCase";
import { Authorize } from "../http/authorization/Authorize";
import { Auth } from "../http/authentication/Auth";
import { HttpClient } from "../http/HttpClient";
import { UserLogged } from "../http/types/express";
import { GetTemplatesDTO } from "../../application/dto/GetTemplatesDTO";
import { ActionType } from "../http/authorization/Permission";
import { ListarTemplatesComCestasDisponiveisUseCase } from "../../application/port/in/ListarTemplatesComCestasDisponiveisUseCase";

export class TemplateController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
        readonly templateUseCase: TemplateUseCase,
        readonly listarTemplatesComCestasDisponiveisUseCase: ListarTemplatesComCestasDisponiveisUseCase
    ) {
        httpClient.on(
            "get", 
            "/template/lista", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarDificuldade),
            async function (_params: any, _data: any, _userLogged?: UserLogged, query?: GetTemplatesDTO) {
                const output = await templateUseCase.listarTemplates(query!);
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: output
                };
            }
        );

        httpClient.on(
            "get", 
            "/template/lista/cesta-disponiveis", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarCesta),
            async function (_params: any, _data: any, _userLogged?: UserLogged) {
                const output = await listarTemplatesComCestasDisponiveisUseCase.execute();
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: output
                };
            }
        );
    }
}