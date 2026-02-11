import { buildApp } from "../dist/main";

let app = null;

export default async (req, res) => {  
  try {
    if (!app) {
      const adapter = await buildApp();
      console.log("Servico em execucao");
      app = await adapter.connect;
    }
    adapter.on(
        'get',
        '/test',  // ← SEM /api!
        (req, res, next) => next(),
        (req, res, next) => next(),
        async () => ({
            statusCode: 200,
            data: {
                message: 'API is working!',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV
            }
        })
    );
    return app(req, res);
  } catch (e) {
    console.log("Error ao subir servico: ", e);
  }
};