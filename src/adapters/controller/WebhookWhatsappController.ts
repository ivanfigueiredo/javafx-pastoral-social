import { HttpClient } from "../http/HttpClient";
import { NextFunction, Request, Response } from "express";

export class WebhookWhatsappController {
    constructor(
        readonly httpClient: HttpClient
    ) {
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