import { NextFunction, Response, Request } from "express";
import { Authorize } from "../http/authorization/Authorize";
import { ActionType } from "../http/authorization/Permission";
import { HttpClient } from "../http/HttpClient";
import { Auth } from "../http/authentication/Auth";
import { EstoqueUseCase } from "../../application/port/in/EstoqueUseCase";
import { CadastroEstoqueDTO } from "../../application/dto/CadastroEstoqueDTO";
import { ConsultaGeracaoTemplateDTO } from "../../application/dto/ConsultaGeracaoTemplateDTO";
import { GeracaoModeloTemplateDTO } from "../../application/dto/GeracaoModeloTemplateDTO";
import { AuditProxy } from "../../application/port/in/AuditProxy";
import { UserLogged } from "../http/types/express";
import { ModeloTemplateCriadoResponse } from "../../application/dto/ModeloTemplateCriadoResponseDTO";
import { TemplateItemDTO } from "../../application/dto/TemplateItemDTO";
import { CriarTemplateDTO } from "../../application/dto/CriarTemplateDTO";
import { TemplateTypeEnum } from "../../application/dto/enuns/TemplateTypeEnum";

export class EstoqueController {
     constructor(
            readonly httpClient: HttpClient,
            readonly auth: Auth,
            readonly authorize: Authorize,
            readonly estoqueUseCase: EstoqueUseCase,
            readonly gerarModeloTemplateProxy: AuditProxy<GeracaoModeloTemplateDTO, ModeloTemplateCriadoResponse>
        ) {
            httpClient.on(
                "post", 
                "/estoque/cadastrar", 
                // auth.authentication.bind(auth),
                // async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.CadastrarItemEstoque),
                (req: Request, res: Response, next: NextFunction) => next(),
                (req: Request, res: Response, next: NextFunction) => next(),
                async function (params: any, data: CadastroEstoqueDTO) {
                    const dto = new CadastroEstoqueDTO(data.validade, data.itemProdutoId, data.codProduto);
                    const output = await estoqueUseCase.cadastrar(dto);
                    return {
                        statusCode: 201,
                        timeStampe: new Date().toISOString(),
                        data: output ?? {}
                    };
                }
            );

            httpClient.on(
                "post", 
                "/estoque/consulta-geracao-template", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ConsultarGeracaoModelo),
                async function (params: any, data: ConsultaGeracaoTemplateDTO) {
                    const dto = new ConsultaGeracaoTemplateDTO(data.templateItens.map(item => new TemplateItemDTO(item.itemProdutoId, item.quantidade)));
                    const output = await estoqueUseCase.consultarGeracaoTemplate(dto);
                    return {
                        statusCode: 200,
                        timeStampe: new Date().toISOString(),
                        data: output
                    };
                }
            );

            httpClient.on(
                "post", 
                "/estoque/geracao-modelo-template", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.CriarModeloTemplate),
                async function (params: any, data: GeracaoModeloTemplateDTO, userLogged?: UserLogged) {
                    const dto = new GeracaoModeloTemplateDTO(
                        data.qtdGeracaoPossivel,
                        new CriarTemplateDTO(data.template.templateDesc, TemplateTypeEnum[data.template.templateType as keyof typeof TemplateTypeEnum], data.template.gerarCestas),
                        data.templateItens.map(item => new TemplateItemDTO(item.itemProdutoId, item.quantidade))
                    );
                    const output = await gerarModeloTemplateProxy.execute(dto, ActionType.CriarModeloTemplate, userLogged!);
                    return {
                        statusCode: 201,
                        timeStampe: new Date().toISOString(),
                        data: output
                    };
                }
            );

            httpClient.on(
                "delete",
                "/estoque/delete/:id",
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.DeletarEstoque),
                async function (params: any, data: any) {
                    const output = await estoqueUseCase.deletar(parseInt(params.id));
                    return {
                        statusCode: 200,
                        timeStampe: new Date().toISOString(),
                        data: output
                    };
                }
            );

            httpClient.on(
                "get", 
                "/estoque/listar/:idItemProduto", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarEstoque),
                async function (params: any, data: any) {
                    const output = await estoqueUseCase.listarEstoqueByIdItemProduto(params.idItemProduto);
                    return {
                        statusCode: 200,
                        timeStampe: new Date().toISOString(),
                        data: output
                    };
                }
            );

            httpClient.on(
                "get", 
                "/estoque/und-medidas/listar", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarUND),
                async function (params: any, data: any) {
                    const output = await estoqueUseCase.listarUnidadeMedida();
                    return {
                        statusCode: 200,
                        timeStampe: new Date().toISOString(),
                        data: output
                    };
                }
            );

            httpClient.on(
                "get", 
                "/estoque/itens/listar", 
                auth.authentication.bind(auth),
                async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarItemProduto),
                async function (params: any, data: any) {
                    const output = await estoqueUseCase.listarItemProduto();
                    return {
                        statusCode: 200,
                        timeStampe: new Date().toISOString(),
                        data: output
                    };
                }
            );

            httpClient.on(
                "post", 
                "/estoque/sugerir-modelo", 
                (req: Request, res: Response, next: NextFunction) => next(),
                (req: Request, res: Response, next: NextFunction) => next(),
                // auth.authentication.bind(auth),
                // async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarDificuldade),
                async function (_params: any, _data: any, _userLogged?: UserLogged) {
                    const output = await estoqueUseCase.sugerirModeloTemplate();
                    return {
                        statusCode: 200,
                        timeStampe: new Date().toISOString(),
                        data: output
                    };
                }
            );
        }
}