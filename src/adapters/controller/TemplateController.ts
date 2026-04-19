import { NextFunction, Response, Request } from "express";
import { TemplateUseCase } from "../../application/port/in/TemplateUseCase";
import { Authorize } from "../http/authorization/Authorize";
import { Auth } from "../http/authentication/Auth";
import { HttpClient } from "../http/HttpClient";
import { UserLogged } from "../http/types/express";
import { GetTemplatesDTO } from "../../application/dto/GetTemplatesDTO";
import { ActionType } from "../http/authorization/Permission";
import { ListarTemplatesComCestasDisponiveisUseCase } from "../../application/port/in/ListarTemplatesComCestasDisponiveisUseCase";
import { TemplateTypeEnum } from "../../application/dto/enuns/TemplateTypeEnum";

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
                const templateType = (query && query.tipoTemplate !== null && query.tipoTemplate !== undefined) ?
                    TemplateTypeEnum[query.tipoTemplate.toUpperCase() as keyof typeof TemplateTypeEnum] : TemplateTypeEnum.CESTA_BASICA;
                const dtoQuery = new GetTemplatesDTO(query?.page ?? 1, query?.pageSize ?? 10, templateType);
                const output = await templateUseCase.listarTemplates(dtoQuery);
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

        httpClient.on(
            "get", 
            "/template/opcao-lista", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarCesta),
            async function (_params: any, _data: any, _userLogged?: UserLogged) {
                const output = await templateUseCase.listarTemplatesOpcaoLista();
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: output
                };
            }
        );
    }
}