/// <reference path="./environment.model.ts" />


export const envConfig: AppEnvironment = {
  processEnv: {
    testing: true,
    recordsOnView: 100,
  },
  matXessQuerier: {
    gitRepo: "https://github.com/nmhillusion/mat-xess-querier.git",
    originJarFileName: "MatXess_Querier-jar-with-dependencies.jar",
    jarFileName: "MatXessQuerier.jar",
  },
};
