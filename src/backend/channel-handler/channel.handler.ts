import { dialog } from "electron";
import { doQueryDatabase } from "../service/msaccess-querier.service";
import { AppStore, AppStoreKey } from "../store";
import { envConfig } from "../environment";

export class ChannelHandler {
  private appStoreInstance: AppStore;
  private readonly MAX_RECORDS: number;

  constructor(app: Electron.App) {
    this.appStoreInstance = new AppStore(app);

    this.MAX_RECORDS = envConfig.processEnv.recordsOnView || 100;
  }

  HANDLER__GET_STORE_VALUE(
    evt: Electron.IpcMainInvokeEvent,
    ...args: unknown[]
  ) {
    console.log("[handler] `get store value` on: ", args);

    const [storeKey] = args;

    const result = this.appStoreInstance.get(String(storeKey));

    console.log(`get store value [${storeKey}] = ${result}`);

    return result;
  }

  HANDLER__QUERY_SQL(evt: Electron.IpcMainInvokeEvent, ...args: unknown[]) {
    console.log("[handler] query sql on: ", args);

    const [query_] = args;

    const wrapperSql = `
      select top ${this.MAX_RECORDS} *
      from (
        ${String(query_)}
      )
    `;

    console.log("[handler] wrapper sql: ", wrapperSql);

    const msAccessResult = doQueryDatabase(
      this.appStoreInstance.get(AppStoreKey.SELECTED_DATABASE),
      wrapperSql
    );

    return msAccessResult;
  }

  async HANDLER__SELECT_FILE(
    evt: Electron.IpcMainInvokeEvent,
    mainWindow: Electron.BrowserWindow,
    ...args: unknown[]
  ) {
    console.log("[handler] select file");

    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Select MS Access Database",
      filters: [
        {
          extensions: ["accdb"],
          name: "MS Access File",
        },
      ],
    });

    this.appStoreInstance.set(
      AppStoreKey.SELECTED_DATABASE,
      String(result.filePaths)
    );

    return result.filePaths;
  }
}
