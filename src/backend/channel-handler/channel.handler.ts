import { AppStore } from "../store";
import { envConfig } from "../environment";
import { BrowserWindow } from "electron";

export abstract class ChannelHandler {
  protected appStoreInstance: AppStore;
  protected readonly MAX_RECORDS: number;

  constructor(
    protected app: Electron.App,
    protected mainWindow: BrowserWindow
  ) {
    this.appStoreInstance = new AppStore(app);

    this.MAX_RECORDS = envConfig.processEnv.recordsOnView || 100;
  }

  abstract handler(evt: Electron.IpcMainInvokeEvent, ...args: unknown[]): void;
}
