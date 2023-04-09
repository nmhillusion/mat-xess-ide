import * as fs from "fs";
import path from "path";

(function __exec__() {
  console.log("build process environment ::");

  const isDev = "PROD" != String(process.env.MODE).trim();

  {
    const sourceFilePath = path.resolve(
      __dirname,
      isDev
        ? "../environment/environment.ts"
        : "../environment/environment.prod.ts"
    );

    const outputConfigFilePaths = [
      path.resolve(__dirname, "../src/backend/environment.ts"),
      path.resolve(__dirname, "../src/frontend/common/environment.ts"),
    ];
    console.log({ sourceFilePath, outputConfigFilePaths });

    outputConfigFilePaths.forEach((outputConfigFilePath) =>
      fs.cpSync(sourceFilePath, outputConfigFilePath)
    );
  }

  {
    const sourceFilePath = path.resolve(
      __dirname,
      "../environment/environment.model.ts"
    );

    const outputConfigFilePaths = [
      path.resolve(__dirname, "../src/backend/environment.model.ts"),
      path.resolve(__dirname, "../src/frontend/common/environment.model.ts"),
    ];
    console.log({ sourceFilePath, outputConfigFilePaths });

    outputConfigFilePaths.forEach((outputConfigFilePath) =>
      fs.cpSync(sourceFilePath, outputConfigFilePath)
    );
  }
})();
