import path from "path";
// import shs from "shelljs";
import { execSync } from "child_process"

export function greet() {
  // shs.config.execPath = path.resolve(__dirname, "../..");
  return execSync("echo hello shelljs");
}
