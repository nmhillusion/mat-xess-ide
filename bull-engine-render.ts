import * as path from "path";
import { BullEngine } from "@nmhillusion/n2ngin-bull-engine";

async function main() {
  const promise_ = await new BullEngine()
    .config({
      rootDir: path.join(__dirname, "./src/frontend"),
      outDir: path.join(__dirname, "./dist/frontend"),
      pug: {
        enabled: true,
        config: {
          pretty: true,
        },
      },
      copyResource: {
        enabled: true,
      },
      scss: {
        enabled: true,
        config: {
          style: "compressed",
        },
      },
      typescript: {
        enabled: true,
        config: {
          sourceMap: true,
          declaration: true,
          declarationMap: true,
        },
      },
      rewriteJavascript: {
        enabled: true,
        config: {
          compress: true,
          rewriteImport: true,
        },
      },
    })
    .render();

  console.log("result render: ", promise_);
}

main();
