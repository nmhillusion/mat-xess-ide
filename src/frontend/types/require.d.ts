interface NodeRequire {
  (ids: string[], handler: () => any);

  config(paths: object): void;
}
