import path from "path";
// import shs from "shelljs";
import { execSync } from "child_process";

export function greet() {
  // shs.config.execPath = path.resolve(__dirname, "../..");
  return execSync(`cmd /c java -jar ./externalLib/MatXessQuerier.jar "d:/temp_data/SampleDb.accdb" "select * from t_user" "out.data.json" > app.log`, {
    encoding: "utf-8",
  });
}
