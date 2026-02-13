import path from 'path';
import { build } from "esbuild";
import nodeExternalsPlugin from "esbuild-plugin-node-externals";
const __dirname = import.meta.dirname;

const entryPoints = [path.join(__dirname, "src/server.ts")]

await build({
  entryPoints,
  bundle: true,
  platform: "node",
  outfile: path.join(__dirname, "public", "server.js"),
  sourcemap: false,
  minify: true,
  plugins: [nodeExternalsPlugin()],
  logLevel: "info",
});
