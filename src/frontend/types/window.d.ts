/// <reference path="./ms-access-result.d.ts" />

interface ElectronApi {
  querySql(sql: string): Promise<MsAccessResult>;
  selectFile(): Promise<string>;
  getAppStoreValue(key_: string): Promise<string>;
}

interface Window {
  meet(): string;
  electronAPI: ElectronApi;
}
