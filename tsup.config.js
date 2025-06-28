import { createConfig } from "./share/tsup.config.js";
import ifdef from "esbuild-ifdef";
export default [
  createConfig({
    copy: [],
    entry: ["src/docx-preview.ts"],
    format: ["cjs", "esm"],
    dts: true,
    minify: true,
  }),
  createConfig({
    copy: ['README.md'],
    entry: ["src/docx-preview.ts"],
    format: ["iife"],
    globalName:'docx',
    minify: "terser",
    shims:false,
    platform:"browser",
    outExtension: () => ({ js: '.browser.js' }),
    external:["jszip"],
    plugins: [
      ifdef({
        verbose: true,
        variables: {
          _BROWSER: true,
        },
        filePath:/\.ts/,
        regExp:/\/[\*\/]{2,}[\s]*#(?<token>.*?)(?:[\s]+(?<expression>.*?))?[\s]*$/
      }),
    ],
  }),
];
