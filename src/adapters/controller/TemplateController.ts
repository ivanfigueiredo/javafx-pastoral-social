import { NextFunction, Response, Request } from "express";
import { CriarTemplateDTO } from "../../application/dto/CriarTemplateDTO";
import { TemplateUseCase } from "../../application/port/in/TemplateUseCase";
import { HttpClient } from "../http/HttpClient";

export class TemplateController {
    constructor(
        readonly httpClient: HttpClient,
        readonly templateUseCase: TemplateUseCase
    ) {
        httpClient.on(
            "post", 
            "/template/criar", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (params: any, data: CriarTemplateDTO) {
                const output = await templateUseCase.criarTemplate(data);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output
                };
            }
        );
    }
}