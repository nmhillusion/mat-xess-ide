import { execSync } from "child_process";
import fs from "fs";

export function __exec__() {
  const isWin = require("os").platform().indexOf("win") > -1;

  const whereCommand = isWin ? "where" : "whereis";

  ////////////////////////////////

  function checkExistCommand(command: string) {
    try {
      const whichResult = execSync(`${whereCommand} ${command}`.trim());
      return fs.existsSync(String(whichResult).trim());
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  ////////////////////////////////

  const REQUIRED_COMMANDS = ["git", "sh", "java"];

  const REQUIRED_COMMANDS_RESULT = REQUIRED_COMMANDS.map(checkExistCommand);

  if (REQUIRED_COMMANDS_RESULT.every(Boolean)) {
    console.log("Successful! Your environment is available now.");

    return true;
  } else {
    console.error(
      "Oh Oh! Your environment is missing some commands: " +
        REQUIRED_COMMANDS_RESULT.filter((cmd_) => !cmd_)
    );

    return false;
  }
}
