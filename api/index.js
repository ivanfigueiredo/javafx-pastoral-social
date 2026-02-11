import { buildApp } from "../dist/main";

let app = null;

export default async (req, res) => {  
  try {
    if (!app) {
      const app = await buildApp();
      console.log("Servico em execucao");
      app = await app.connect;
    }
    return app(req, res);
  } catch (e) {
    console.log("Error ao subir servico: ", e);
  }
};