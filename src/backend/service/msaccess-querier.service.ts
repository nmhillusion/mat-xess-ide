/// <reference path="../share/types/ms-access-result.d.ts" />

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

export function doQueryDatabase(
  databasePath: string,
  query: string
): MsAccessResult {
  if (!databasePath) {
    throw new Error("Empty database path");
  }

  if (!query) {
    throw new Error("Empty query");
  }

  const tmpQueryFile = path.resolve(__dirname, "~query.sql");

  fs.writeFileSync(tmpQueryFile, query);

  const command_ = `cmd /c java -jar ./externalLib/MatXessQuerier.jar "${databasePath}" "${tmpQueryFile}" "out.data.json" > app.log`;

  console.log("command to exec query... ", command_);

  execSync(command_, {
    encoding: "utf-8",
  });

  fs.unlinkSync(tmpQueryFile);

  return JSON.parse(fs.readFileSync("out.data.json").toString());
}
