import express, { Request, Response, NextFunction } from 'express';
import { HttpClient } from './HttpClient';

export class ExpressAdapter implements HttpClient {
    connect: any;

    constructor() {
        this.connect = express();
        this.connect.use(express.json());
    }

    on(
        method: string, 
        url: string, 
        middlewareAuth: (req: Request, res: Response, next: NextFunction) => void,
        middlewareAuthorize: (req: Request, res: Response, next: NextFunction) => void,
        callback: Function
    ): void {
        this.connect[method](url, middlewareAuth, middlewareAuthorize, async (req: Request, res: Response) => {
            try {
                const output = await callback(req.params, req.body);
                res.json(output);
            } catch (error: any) {
                res.status(500).json(error.message);
            }
        });
    }

    listen(port: number, callback: Function): void {
        this.connect.listen(port, callback());
    }
}