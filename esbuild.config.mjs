import path from 'path';
import { build } from "esbuild";
import nodeExternalsPlugin from "esbuild-plugin-node-externals";
const __dirname = import.meta.dirname;

const isProduction = process.env.ENVIRONMENT === 'production';
const dir = isProduction ? "src/server.ts" : "src/main.ts"
const entryPoints = [path.join(__dirname, dir)]
const fileDest = isProduction ? "server.js" : "main.js";
const dirDest = isProduction ? "public" : "dist";

await build({
  entryPoints,
  bundle: true,
  platform: "node",
  outfile: path.join(__dirname, dirDest, fileDest),
  sourcemap: false,
  minify: true,
  plugins: [nodeExternalsPlugin()],
  logLevel: "info",
});
