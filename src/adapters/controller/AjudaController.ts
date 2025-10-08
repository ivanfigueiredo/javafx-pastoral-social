import { NextFunction, Request, Response } from "express";
import { AssociarAjudaFamiliaDTO } from "../../application/dto/AssociarAjudaFamiliaDTO";
import { Auth } from "../http/authentication/Auth";
import { Authorize } from "../http/authorization/Authorize";
import { HttpClient } from "../http/HttpClient";
import { ActionType } from "../http/authorization/Permission";
import { UserLogged } from "../http/types/express";
import { AssociarFamiliaAjudaUseCase } from "../../application/port/in/AssociarFamiliaAjudaUseCase";

export class AjudaController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
        readonly associarFamiliaAjudaUseCase: AssociarFamiliaAjudaUseCase
    ) {
        httpClient.on(
            "post", 
            "/ajuda/associar-familia", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.AssociarFamiliaAjuda),
            async function (params: any, data: AssociarAjudaFamiliaDTO[], userLogged?: UserLogged) {
                const output = await associarFamiliaAjudaUseCase.execute(data);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );
    }
}