import { Request, Response, NextFunction } from "express";
import { HttpClient } from "../http/HttpClient";
import { ConsultarProdutosProxVencimentoService } from "../../application/service/ConsultarProdutosProxVencimentoService";
import { IniciarAcaoUseCase } from "../../application/port/in/IniciarAcaoUseCase";
import { EstoqueUseCase } from "../../application/port/in/EstoqueUseCase";

export class NotificacaoController {
    constructor(
        readonly httpClient: HttpClient,
        readonly consultarProdutosProxVencimentoUseCase: ConsultarProdutosProxVencimentoService,
        readonly iniciarAcaoUseCase: IniciarAcaoUseCase,
        readonly estoqueUseCase: EstoqueUseCase
    ) {
        httpClient.on(
            "get", 
            "/notificacao/produtos-proximo-vencimento", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (_params: any, _data: any) {
                await consultarProdutosProxVencimentoUseCase.execute();
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: {ok: true}
                };
            }
        );

        httpClient.on(
            "get", 
            "/notificacao/iniciar-acao", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (_params: any, _data: any) {
                await iniciarAcaoUseCase.execute();
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: {ok: true}
                };
            }
        );

        httpClient.on(
            "get", 
            "/notificacao/remover-produtos-vencidos", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (_params: any, _data: any) {
                await estoqueUseCase.removerProdutosVencidos();
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: {ok: true}
                };
            }
        );
        
    }
}