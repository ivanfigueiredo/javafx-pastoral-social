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
                async (req: Request, res: Response, next: NextFunction) => next(),
                async (req: Request, res: Response, next: NextFunction) => next(),
                async function (params: any, data: CadastroAlimentoDTO) {
                    const output = await alimentoUseCase.cadastrar(data);
                    return output;
                }
            );

            httpClient.on(
                "get", 
                "/list-und", 
                async (req: Request, res: Response, next: NextFunction) => next(),
                async (req: Request, res: Response, next: NextFunction) => next(),
                async function (params: any, data: any) {
                    const output = await alimentoUseCase.listarUnidadeMedida();
                    return output;
                }
            );

            httpClient.on(
                "get", 
                "/list-localizacao", 
                async (req: Request, res: Response, next: NextFunction) => next(),
                async (req: Request, res: Response, next: NextFunction) => next(),
                async function (params: any, data: any) {
                    const output = await alimentoUseCase.listarLocalizacao();
                    return output;
                }
            );

            httpClient.on(
                "get", 
                "/list-item-produto", 
                async (req: Request, res: Response, next: NextFunction) => next(),
                async (req: Request, res: Response, next: NextFunction) => next(),
                async function (params: any, data: any) {
                    const output = await alimentoUseCase.listarItemProduto();
                    return output;
                }
            );
        }
}