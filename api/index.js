import { buildApp } from "../dist/main";

export default async (req, res) => {
  const app = await buildApp();
  return app.connect(req, res);
};