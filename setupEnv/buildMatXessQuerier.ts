import { exec } from "child_process";
import path from "path";
import { envConfig } from "../environment/environment";

const matXessQuerierPath = path.resolve(
  __dirname,
  "../temp_repo/matXessQuerier"
);

const originJarFileName = envConfig.matXessQuerier.originJarFileName;

const externalLibPath = path.resolve(__dirname, "../externalLib");

const jarFileName = envConfig.matXessQuerier.jarFileName;

/// EXE COMMAND FILE //////////////////////////////////
const commandFilePath = path.resolve(__dirname, "./buildMatXessQuerier.sh");
const builtCommand = `sh "${commandFilePath}" -r "${envConfig.matXessQuerier.gitRepo}" -p "${matXessQuerierPath}" -o "${originJarFileName}" -j "${jarFileName}" -l "${externalLibPath}"`;

console.log({ builtCommand });

const _childProcess = exec(builtCommand);

console.log({ _childProcess: _childProcess.pid });

_childProcess.on("message", (msg) => {
  console.log("msg: ", msg);
});

_childProcess.stdout?.on("data", (chunk_) => {
  console.log("stdout: ", chunk_);
});

_childProcess.stderr?.on("data", (chunk_) => {
  console.error("stderr: ", chunk_);
});
_childProcess.stderr?.on("error", (chunk_) => {
  console.error("stderr: ", chunk_);
});
