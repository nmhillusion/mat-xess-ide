import path from "path";
import * as fs from "fs";
import { execSync } from "child_process";

export function greet() {
  // shs.config.execPath = path.resolve(__dirname, "../..");
  return execSync(
    `cmd /c java -jar ./externalLib/MatXessQuerier.jar "d:/temp_data/SampleDb.accdb" "select * from t_user" "out.data.json" > app.log`,
    {
      encoding: "utf-8",
    }
  );
}

export function doQueryDatabase(databasePath: string, query: string) {
  if (!databasePath) {
    throw new Error("Empty database path");
  }

  if (!query) {
    throw new Error("Empty query");
  }

  execSync(
    `cmd /c java -jar ./externalLib/MatXessQuerier.jar "${databasePath}" "${query}" "out.data.json" > app.log`,
    {
      encoding: "utf-8",
    }
  );

  return fs.readFileSync("out.data.json").toString();
}
