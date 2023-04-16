/// <reference path="../common/share/types/ms-access-result.d.ts" />

interface ElectronApi {
  querySql(sql: string): Promise<MsAccessResult>;
  selectFile(): Promise<string>;
  getAppStoreValue(key_: string): Promise<string>;
  exportExcelQuery(sql: string): Promise<void>;
  openQueryFile(): Promise<string>;
}

interface Window {
  meet(): string;
  electronAPI: ElectronApi;
}
