import { NextFunction, Response, Request } from "express";
import { TemplateUseCase } from "../../application/port/in/TemplateUseCase";
import { HttpClient } from "../http/HttpClient";
import { UserLogged } from "../http/types/express";
import { GetTemplatesDTO } from "../../application/dto/GetTemplatesDTO";

export class TemplateController {
    constructor(
        readonly httpClient: HttpClient,
        readonly templateUseCase: TemplateUseCase
    ) {
        httpClient.on(
            "get", 
            "/template/lista", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            // auth.authentication.bind(auth),
            // async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarDificuldade),
            async function (_params: any, _data: any, _userLogged?: UserLogged, query?: GetTemplatesDTO) {
                const output = await templateUseCase.listarTemplates(query!);
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: output
                };
            }
        );
    }
}