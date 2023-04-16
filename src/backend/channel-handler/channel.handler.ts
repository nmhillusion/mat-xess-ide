import { AppStore } from "../store";
import { envConfig } from "../share/environment/environment";
import { BrowserWindow, dialog } from "electron";

export abstract class ChannelHandler<T> {
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

  async emitEvent(evt: Electron.IpcMainInvokeEvent, ...args: unknown[]): Promise<T> {
    try {
      return await this.__realEmitEvent(evt, ...args);
    } catch (error) {
      dialog.showErrorBox("Error when executing", error);
    }
  }

  abstract __realEmitEvent(
    evt: Electron.IpcMainInvokeEvent,
    ...args: unknown[]
  ): Promise<T>;
}
