import "reflect-metadata";
import { buildApp } from "./main";

let app: any = null;

export default async function handler(req: any, res: any) {
    if (!app) {
        app = await buildApp();
    }
  app(req, res);
}