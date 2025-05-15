import { NextFunction, Response, Request } from "express";
import { Authorize } from "./http/authorization/Authorize";
import { ActionType } from "./http/authorization/Permission";
import { HttpClient } from "./http/HttpClient";
import { Auth } from "./http/authentication/Auth";
import { AlimentoUseCase } from "../application/port/in/AlimentoUseCase";
import { CadastroAlimentoDTO } from "../application/dto/CadastroAlimentoDTO";

export class AlimentoController {
     constructor(
            readonly httpClient: HttpClient,
            readonly auth: Auth,
            readonly authorize: Authorize,
            readonly alimentoUseCase: AlimentoUseCase
        ) {
            httpClient.on(
                "post", 
                "/cadastrar-alimento", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.CadastrarItemEstoque),
                async function (params: any, data: CadastroAlimentoDTO) {
                    const output = await alimentoUseCase.cadastrar(data);
                    return output;
                }
            );

            httpClient.on(
                "get", 
                "/list-und", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarUND),
                async function (params: any, data: any) {
                    const output = await alimentoUseCase.listarUnidadeMedida();
                    return output;
                }
            );

            httpClient.on(
                "get", 
                "/list-localizacao", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarLocalizacao),
                async function (params: any, data: any) {
                    const output = await alimentoUseCase.listarLocalizacao();
                    return output;
                }
            );

            httpClient.on(
                "get", 
                "/list-item-produto", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarItemProduto),
                async function (params: any, data: any) {
                    const output = await alimentoUseCase.listarItemProduto();
                    return output;
                }
            );
        }
}