import { NextFunction, Request, Response } from "express";
import { UserLogged } from "./types/express";

export type CallbackFunction = (req: Request, res: Response, next: NextFunction) => void;
export type OutputType = {
    statusCode: number;
    timeStampe: string;
    data: any;
}

export type Callback = (params: any, data: any, userLogged?: UserLogged, query?: any) => Promise<OutputType>;

export interface HttpClient {
    on: (
        method: string, 
        url: string, 
        middlewareAuth: CallbackFunction,
        middlewareAuthorize: CallbackFunction, 
        callback: Callback,
    ) => void;
    listen: (port: number, callback: Function) => void;
}