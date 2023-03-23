import { __exec__ as execBuildMatXessQuerier } from "./buildMatXessQuerier";
import { __exec__ as execCheckRequiredEnvCommands } from "./checkRequiredEnvCommands";

if (execCheckRequiredEnvCommands()) {
  execBuildMatXessQuerier();
}

console.log("<< FINISH SETUP ENV");
