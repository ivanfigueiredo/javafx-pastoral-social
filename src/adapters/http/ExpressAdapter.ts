import express, { Request, Response } from 'express';
import { CallbackFunction, HttpClient } from './HttpClient';
import { UnauthorizedException } from '../../application/exceptions/UnauthorizedException';

export class ExpressAdapter implements HttpClient {
    connect: any;

    constructor() {
        this.connect = express();
        this.connect.use(express.json());
    }

    on(
        method: string, 
        url: string, 
        middlewareAuth: CallbackFunction,
        middlewareAuthorize: CallbackFunction, 
        callback: Function
    ): void {
        this.connect[method](url, middlewareAuth, middlewareAuthorize, async (req: Request, res: Response) => {
            try {
                const output = await callback(req.params, req.body);
                res.json(output);
            } catch (error: any) {
                if (error instanceof UnauthorizedException) {
                    res.status(error.statusCode).json(error);
                    return;
                }
                res.status(500).json(error.message);
            }
        });
    }

    listen(port: number, callback: Function): void {
        this.connect.listen(port, callback());
    }
}