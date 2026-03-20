import { Request, Response, NextFunction } from "express";
import { HttpClient } from "../http/HttpClient";
import { ConsultarProdutosProxVencimentoService } from "../../application/service/ConsultarProdutosProxVencimentoService";

export class NotificacaoController {
    constructor(
        readonly httpClient: HttpClient,
        readonly consultarProdutosProxVencimentoUseCase: ConsultarProdutosProxVencimentoService
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
        
    }
}