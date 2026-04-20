import { NextFunction, Request, Response } from "express";
import { Auth } from "../http/authentication/Auth";
import { Authorize } from "../http/authorization/Authorize";
import { HttpClient } from "../http/HttpClient";
import { ActionType } from "../http/authorization/Permission";
import { AcaoUseCase } from "../../application/port/in/AcaoUseCase";
import { CadastrarAcaoDTO } from "../../application/dto/CadastrarAcaoDTO";
import { TipoAcaoEnum } from "../../application/dto/enuns/TipoAcaoEnum";
import { TemplateItemDTO } from "../../application/dto/TemplateItemDTO";
import { UserLogged } from "../http/types/express";
import { AcaoFilterQueryDTO } from "../../application/dto/acao/AcaoFilterQueryDTO";
import { AtualizarAcaoDTO } from "../../application/dto/acao/AtualizarAcaoDTO";

export class AcaoController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
        readonly acaoUseCase: AcaoUseCase
    ) {
        httpClient.on(
            "post", 
            "/acao/cadastrar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.CadastrarAcao),
            async function (params: any, data: CadastrarAcaoDTO) {
                const dto = new CadastrarAcaoDTO(
                    data.titulo, 
                    data.descricao, 
                    data.dataEvento, 
                    data.inicioAcao,
                    TipoAcaoEnum[data.tipoAcao as keyof typeof TipoAcaoEnum],
                    (data.itens !== undefined && data.itens !== null && data.itens.length > 0) ?
                        data.itens.map(item => new TemplateItemDTO(item.itemProdutoId, item.quantidade)) : undefined,
                    data?.qtdAcaoSocial
                );
                const output = await acaoUseCase.cadastrarAcao(dto);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );

        httpClient.on(
            "get", 
            "/acao/listar", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (params: any, data: any, __userLogged?: UserLogged, query?: AcaoFilterQueryDTO) {
                const dtoQuery = new AcaoFilterQueryDTO(query?.page ?? 1, query?.pageSize ?? 10, query?.dataInicio, query?.dataFim, query?.statusAcao);
                const output = await acaoUseCase.listarAcoes(dtoQuery);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );

        httpClient.on(
            "get", 
            "/acao/:idAcao", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (params: any, data: any) {
                const output = await acaoUseCase.getAcao(params.idAcao);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );

        httpClient.on(
            "put", 
            "/acao/atualizar/:idAcao", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.AtualizarAcao),
            async function (params: any, data: any) {
                const dto = new AtualizarAcaoDTO(
                    params.idAcao,
                    data?.titulo,
                    data?.descricao,
                    data?.dataEvento,
                    data?.inicioAcao
                );
                const output = await acaoUseCase.atualizarAcao(dto);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );

    }
}