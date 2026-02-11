import { HttpClient } from "../http/HttpClient";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";

const packageJsonPath = path.join(process.cwd(), "package.json");

interface PackageJson {
  name: string;
  version: string;
}

const { name, version } = JSON.parse(
  fs.readFileSync(packageJsonPath, "utf8")
) as PackageJson;

export class HealthCheckController {
    constructor(
        readonly httpClient: HttpClient
    ) {
        httpClient.on(
            "get", 
            "/api/health", 
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function () { 
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: {
                        status: "ok",
                        service: name,
                        version,
                        environment: process.env.NODE_ENV || "development",
                        uptime: process.uptime(), 
                    }
                };
            }
        );
    }
}