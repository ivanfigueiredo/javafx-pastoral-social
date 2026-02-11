import { buildApp } from "../dist/main";

export default async (req, res) => {
  const app = await buildApp();
  try {
    console.log("Servico em execucao");
    return await app.connect(req, res);
  } catch (e) {
    console.log("Error ao subir servico: ", e);
  }
};