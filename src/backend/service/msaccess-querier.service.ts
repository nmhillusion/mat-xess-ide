/// <reference path="../share/types/ms-access-result.d.ts" />

import path from "path";
import * as fs from "fs";
import { execSync } from "child_process";

export function doQueryDatabase(
  databasePath: string,
  query: string
): MsAccessResult {
  try {
    if (!databasePath) {
      throw new Error("Empty database path");
    }

    if (!query) {
      throw new Error("Empty query");
    }

    const tmpQueryFile = path.resolve(__dirname, "~query.sql");
    const outDataFile = "out.data.json";

    fs.writeFileSync(tmpQueryFile, query);

    const command_ = `%cd%/externalLib/execMatXessQuerier.bat "${databasePath.replace(
      /\\/g,
      "/"
    )}" "${tmpQueryFile.replace(/\\/g, "/")}" "${outDataFile}"`;

    console.log("command to exec query... ", command_);

    execSync(command_, {
      encoding: "utf-8",
      windowsHide: true,
    });

    const result_ = JSON.parse(fs.readFileSync("out.data.json").toString());

    fs.unlinkSync(tmpQueryFile);
    fs.unlinkSync(outDataFile);

    return result_;
  } catch (e) {
    console.error("ERROR: ", e);
    throw e;
  }
}
