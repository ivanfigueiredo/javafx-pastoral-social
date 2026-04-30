import { HttpClient } from "../http/HttpClient";
import { NextFunction, Request, Response } from "express";
import { UserLogged } from "../http/types/express";
import { UnauthorizedException } from "../../application/exceptions/UnauthorizedException";
import { WhatsappMetaMapper } from "../mappers/WhatsappMetaMapper";
import { VisualizarProdutosProxVencimentoUseCase } from "../../application/port/in/VisualizarProdutosProxVencimentoUseCase";
import { TempDataRepository } from "../../application/port/out/TempDataRepository";
import { TempDataEntity } from "../persistence/entities/TempDataEntity";

export class WebhookWhatsappController {
    constructor(
        readonly httpClient: HttpClient,
        readonly visualizarProdutosProxVencimentoUseCase: VisualizarProdutosProxVencimentoUseCase,
        readonly tempDataRepository: TempDataRepository
    ) {
        httpClient.on(
            "get", 
            "/whatsapp/webhook", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (params: any, data: any, userLogged?: UserLogged, query?: any) {
                const token = query['hub.verify_token'];
                const challenge = query['hub.challenge'];
                const verifyToken = process.env.SECRET_TOKEN_META;
                if ((!token && !verifyToken) || token !== verifyToken) throw new UnauthorizedException('Token de verificação inválido.');
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: challenge
                };
            }
        );

        httpClient.on(
            "post", 
            "/whatsapp/webhook", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (params: any, data: any) {
                try {
                    const payload = WhatsappMetaMapper.toWebHookMetaPayloadDTO(data);
                    console.dir("Recebido novo webhook do WhatsApp: " + JSON.stringify(payload, null, 2), {depth: null});
                    if (payload.entry.length > 0 && payload.entry[0].changes.length > 0) {
                        for (const entry of payload.entry) {
                            const changes = entry.changes;
                            for (const change of changes) {
                                const value = change.value;
                                if (value.messages && value.messages.length > 0 && value.contacts && value.contacts.length > 0) {
                                    await tempDataRepository.save(new TempDataEntity(null, {payload: data, action: 'RecebimentoWebhookWhatsApp'}, new Date()));
                                    await visualizarProdutosProxVencimentoUseCase.execute(value.contacts, value.messages);
                                }
                                if (value.statuses) {
                                    await tempDataRepository.save(new TempDataEntity(null, {payload: data, action: 'RecebimentoWebhookWhatsApp'}, new Date()));
                                    console.dir("Recebida nova atualização de status via WhatsApp: " + JSON.stringify(value.statuses, null, 2), {depth: null});
                                }
                            }
                        }
                    }
                } catch (e: any) {
                    await tempDataRepository.save(new TempDataEntity(null, {Erro: e, action: 'ProcessamentoWebhookWhatsApp'}, new Date()));
                }
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: "OK"
                };
            }
        );
    }
}