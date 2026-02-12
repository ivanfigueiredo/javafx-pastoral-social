import { build } from "esbuild";
import nodeExternalsPlugin from "esbuild-plugin-node-externals";


await build({
  entryPoints: ["src/server.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  outdir: "dist",
  sourcemap: true,
  minify: true,
  plugins: [nodeExternalsPlugin()],
  logLevel: "info",
});
