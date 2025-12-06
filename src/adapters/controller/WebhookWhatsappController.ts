import { HttpClient } from "../http/HttpClient";
import { NextFunction, Request, Response } from "express";
import { UserLogged } from "../http/types/express";

export class WebhookWhatsappController {
    constructor(
        readonly httpClient: HttpClient
    ) {
        httpClient.on(
            "get", 
            "/whatsapp/webhook", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (params: any, data: any, userLogged?: UserLogged, query?: any) {
                const mode = query['hub.mode'];
                const token = query['hub.verify_token'];
                const challenge = query['hub.challenge'];

                console.log('Recebendo verificação de webhook:', { mode, token, challenge });

                const verifyToken = 'token_secreto';

                if (token) {
                    if (token === verifyToken) {
                        console.log('Webhook verificado com sucesso!');
                        return {
                            statusCode: 200,
                            timeStampe: new Date().toISOString(),
                            data: challenge
                        };
                    } else {
                        console.error('Falha na verificação. Token inválido.');
                        return {
                            statusCode: 403,
                            timeStampe: new Date().toISOString(),
                            data: {}
                        };
                    }
                } else {
                    console.error('Parâmetros de verificação ausentes.');
                    return {
                        statusCode: 400,
                        timeStampe: new Date().toISOString(),
                        data: {}
                    };
                }
            }
        );

        httpClient.on(
            "post", 
            "/whatsapp/webhook", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (params: any, data: any) {
                console.log('Webhook received data:', JSON.stringify(data, null, 2));
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data
                };
            }
        );
    }
}