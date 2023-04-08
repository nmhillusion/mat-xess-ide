interface ElectronApi {
  querySql(sql: string): Promise<void>;
  selectFile(): Promise<string>;
}

interface Window {
  meet(): string;
  electronAPI: ElectronApi;
}
