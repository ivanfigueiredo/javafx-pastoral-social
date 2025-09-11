import { NextFunction, Response, Request } from "express";
import { Authorize } from "../http/authorization/Authorize";
import { ActionType } from "../http/authorization/Permission";
import { HttpClient } from "../http/HttpClient";
import { Auth } from "../http/authentication/Auth";
import { EstoqueUseCase } from "../../application/port/in/EstoqueUseCase";
import { CadastroEstoqueDTO } from "../../application/dto/CadastroEstoqueDTO";
import { ConsultaGeracaoTemplateDTO } from "../../application/dto/ConsultaGeracaoTemplateDTO";

export class EstoqueController {
     constructor(
            readonly httpClient: HttpClient,
            readonly auth: Auth,
            readonly authorize: Authorize,
            readonly estoqueUseCase: EstoqueUseCase
        ) {
            httpClient.on(
                "post", 
                "/estoque/cadastrar", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.CadastrarItemEstoque),
                async function (params: any, data: CadastroEstoqueDTO) {
                    const output = await estoqueUseCase.cadastrar(data);
                    return output;
                }
            );

            httpClient.on(
                "post", 
                "/estoque/consulta-geracao-template", 
                // auth.authentication.bind(auth),
                // async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.CadastrarItemEstoque),
                (req: Request, res: Response, next: NextFunction) => next(),
                (req: Request, res: Response, next: NextFunction) => next(),
                async function (params: any, data: ConsultaGeracaoTemplateDTO) {
                    const output = await estoqueUseCase.consultarGeracaoTemplate(data);
                    return output;
                }
            );

            httpClient.on(
                "delete",
                "/estoque/delete/:id",
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.DeletarEstoque),
                async function (params: any, data: any) {
                    const output = await estoqueUseCase.deletar(parseInt(params.id));
                    return output;
                }
            );

            httpClient.on(
                "get", 
                "/estoque/listar", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarEstoque),
                async function (params: any, data: any) {
                    const output = await estoqueUseCase.listarAlimentos();
                    return output;
                }
            );

            httpClient.on(
                "get", 
                "/und-medidas/listar", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarUND),
                async function (params: any, data: any) {
                    const output = await estoqueUseCase.listarUnidadeMedida();
                    return output;
                }
            );

            httpClient.on(
                "get", 
                "/estoque/localizacao/listar", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarLocalizacao),
                async function (params: any, data: any) {
                    const output = await estoqueUseCase.listarLocalizacao();
                    return output;
                }
            );

            httpClient.on(
                "get", 
                "/itens/listar", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarItemProduto),
                async function (params: any, data: any) {
                    const output = await estoqueUseCase.listarItemProduto();
                    return output;
                }
            );
        }
}