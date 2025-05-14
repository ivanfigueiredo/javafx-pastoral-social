import { NextFunction, Request, Response } from "express";

export type CallbackFunction = (req: Request, res: Response, next: NextFunction) => void;

export interface HttpClient {
    on: (
        method: string, 
        url: string, 
        middlewareAuth: CallbackFunction,
        middlewareAuthorize: CallbackFunction, 
        callback: (params: any, data: any) => any
    ) => void;
    listen: (port: number, callback: Function) => void;
}