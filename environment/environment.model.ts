export interface AppEnvironment {
  processEnv: {
    testing: boolean;
    recordsOnView: number;
  };
  matXessQuerier: {
    gitRepo: string;
    originJarFileName: string;
    jarFileName: string;
  };
}
