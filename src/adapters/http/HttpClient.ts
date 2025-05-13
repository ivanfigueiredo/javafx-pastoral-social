import { NextFunction, Request, Response } from "express";

export interface HttpClient {
    on: (
        method: string, 
        url: string, 
        middlewareAuth: (req: Request, res: Response, next: NextFunction) => void, 
        middlewareAuthorize: (req: Request, res: Response, next: NextFunction) => void, 
        callback: (params: any, data: any) => any
    ) => void;
    listen: (port: number, callback: Function) => void;
}