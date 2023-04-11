import { AppEnvironment } from "./environment.model";

export const envConfig: AppEnvironment = {
  processEnv: {
    testing: false,
    recordsOnView: 100,
  },
  matXessQuerier: {
    gitRepo: "https://github.com/nmhillusion/mat-xess-querier.git",
    originJarFileName: "MatXess_Querier-jar-with-dependencies.jar",
    jarFileName: "MatXessQuerier.jar",
  },
};
