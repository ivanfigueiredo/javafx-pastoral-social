import express, { Request, Response, Router, Express } from 'express';
import { HttpLogger } from 'pino-http';
import { Callback, CallbackFunction, HttpClient } from './HttpClient';
import { UnauthorizedException } from '../../application/exceptions/UnauthorizedException';
import { UnprocessableException } from '../../application/exceptions/UnprocessableException';
import { InternalServerErrorException } from '../../application/exceptions/InternalServerErrorException';
import { NotFoundException } from '../../application/exceptions/NotFoundException';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';


export class ExpressAdapter implements HttpClient {
    connect: Express;
    router: Router

    constructor(private readonly httpLogger: HttpLogger) {
        this.connect = express();
        this.router = express.Router();
        this.connect.use(express.json());
        this.connect.use('/api', this.router);
        this.connect.use(httpLogger);
    }

    on(
        method: HttpMethod, 
        url: string, 
        middlewareAuth: CallbackFunction,
        middlewareAuthorize: CallbackFunction, 
        callback: Callback,
    ): void {
        this.router[method](url, middlewareAuth, middlewareAuthorize, async (req: Request, res: Response) => {
            try {
                const output = await callback(req.params, req.body, req?.user, req.query);
                if (typeof output?.data === 'string') {
                    res.status(output.statusCode).send(output.data);
                    return;
                }
                res.status(output.statusCode).json(output);
            } catch (error: any) {
                if (error instanceof UnauthorizedException) {
                    res.status(error.statusCode).json(error);
                    return;
                }
                if (error instanceof UnprocessableException) {
                    res.status(error.statusCode).json(error);
                    return;
                }
                if (error instanceof InternalServerErrorException) {
                    res.status(error.statusCode).json(error);
                    return;
                }
                if (error instanceof NotFoundException) {
                    res.status(error.statusCode).json(error);
                    return;
                }
                res.status(500).json(error.message);
            }
        });
    }

    public getExpress(): Express {
        return this.connect;
    }
}