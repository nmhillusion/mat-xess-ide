interface ElectronApi {
  querySql(sql: string): Promise<void>;
  selectFile(): Promise<string>;
  getAppStoreValue(key_: string): Promise<string>;
}

interface Window {
  meet(): string;
  electronAPI: ElectronApi;
}
