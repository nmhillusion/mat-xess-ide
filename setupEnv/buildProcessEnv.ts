import * as fs from "fs";
import path from "path";

(function __exec__() {
  console.log("build process environment ::");

  const sourceFilePath = path.resolve(
    __dirname,
    "../environment/environment.ts"
  );

  const outputConfigFilePath = path.resolve(
    __dirname,
    "../src/backend/environment.ts"
  );

  console.log({ outputConfigFilePath });

  fs.cpSync(sourceFilePath, outputConfigFilePath);
})();
