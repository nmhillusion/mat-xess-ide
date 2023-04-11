import * as fs from "fs";
import path from "path";

function __exec__() {
  const fromPath = path.resolve(__dirname, "../src/share");
  const toPaths = [
    path.resolve(__dirname, "../src/backend/share"),
    path.resolve(__dirname, "../src/frontend/common/share"),
  ];

  toPaths.forEach((toPath) =>
    fs.cpSync(fromPath, toPath, {
      recursive: true,
    })
  );
}

__exec__();
