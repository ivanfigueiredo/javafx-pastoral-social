import { NextFunction, Request, Response, Application } from "express";
import { UserLogged } from "./types/express";

export type CallbackFunction = (req: Request, res: Response, next: NextFunction) => void;
export type OutputType = {
    statusCode: number;
    timeStampe: string;
    data: any;
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type Callback = (params: any, data: any, userLogged?: UserLogged, query?: any) => Promise<OutputType>;

export interface HttpClient {
    on: (
        method: HttpMethod, 
        url: string, 
        middlewareAuth: CallbackFunction,
        middlewareAuthorize: CallbackFunction, 
        callback: Callback,
    ) => void;
    getExpress: () => Application;
}