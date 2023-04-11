import { AppStore } from "../store";
import { envConfig } from "../environment";
import { BrowserWindow } from "electron";

export abstract class ChannelHandler {
  protected static appStoreInstance: AppStore;
  protected static MAX_RECORDS: number;

  constructor(
    protected app: Electron.App,
    protected mainWindow: BrowserWindow
  ) {
    if (null == ChannelHandler.appStoreInstance) {
      ChannelHandler.appStoreInstance = new AppStore(app);
      ChannelHandler.MAX_RECORDS = envConfig.processEnv.recordsOnView || 100;
    }
  }

  abstract handler(evt: Electron.IpcMainInvokeEvent, ...args: unknown[]): void;
}
