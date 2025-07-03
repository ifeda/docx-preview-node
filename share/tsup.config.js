import { defineConfig } from "tsup";
import { existsSync, copyFile, readFileSync, writeFileSync } from "fs";
import path from "path";
const pkg = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "./package.json"), "utf8")
);
const copy = [];
let timer = null;
function buildEnd(options) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    for (const file of copy) {
      const src = path.resolve(file);
      const dest = path.resolve(options.outDir, path.basename(file));
      copyFile(src, dest, (err) => {
        if (err) console.error('[copy] failed:',src,'=>',dest,err);
        else  console.debug('[copy] success:',src,'=>',dest)
      });
    }
    delete pkg.scripts;
    delete pkg.devDependencies;
    pkg.files = ["*"],
    writeFileSync(
      path.resolve(options.outDir, "package.json"),
      JSON.stringify(pkg, null, 2)
    );
  }, 2000);
}
const defaults = {
  copy: [],
  plugins: [],
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs"],
  external: [],
  dts: true,
  clean: false,
  bundle: true,
  minify: "terser",
  globalName: undefined,
  target: "node18",
  platform: "node",
  skipNodeModulesBundle: true, // Skip node_modules bundling
  replaceNodeEnv: true,
  keepNames: true,
  loader: {
    ".json": "json",
    ".pem": "text",
    ".crt": "text",
    ".key": "text",
    ".txt": "text",
    ".md": "text",
    ".html": "text",
    ".htm": "text",
    ".png": "dataurl",
    ".jpg": "dataurl",
    ".jpeg": "dataurl",
    ".gif": "dataurl",
    ".svg": "dataurl",
    ".webp": "dataurl",
    ".ico": "dataurl",
  },
  splitting: false,
  sourcemap: false,
  treeshake: true,
};

export function createConfig(opts) {
  if(Array.isArray(opts.copy)){
    opts.copy.forEach(file=>{
      if(!copy.includes(file))copy.push(file);
    })
  }
  const options = {
    ...defaults,
    ...opts,
  };
  delete options.copy
  const plugins=options.plugins
  delete options.plugins

  return defineConfig({
    ...options,
    esbuildOptions: (opts) => {
      opts.external = options.external; //fix option.external has no effect, may be a tsup's bug
    },
    esbuildPlugins: [
      ...plugins,
      {
        name: "custom",
        setup(build) {
          const format = build.initialOptions.define.TSUP_FORMAT,
            distFileName =
              path.basename(
                build.initialOptions.entryPoints[0],
                path.extname(build.initialOptions.entryPoints[0])
              ) + build.initialOptions.outExtension[".js"];
          if (format === '"cjs"') {
            pkg.main = distFileName;
          }
          if (format === '"esm"') {
            pkg.module = distFileName;
          }
          if (format === '"iife"') {
            pkg.browser = distFileName;
          }
          build.onEnd(() => buildEnd(options));
        },
      },
    ],
  });
}
