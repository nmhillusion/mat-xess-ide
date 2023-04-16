import { IpcRenderer } from "electron";

export enum ChannelType {
  OPEN_QUERY_FILE = "__open-query-file__",
  QUERY_SQL = "__query-sql__",
  SELECT_MS_DATABASE_FILE = "__select-ms-database-file__",
  GET_STORE_VALUE = "__get-store-value__",
  EXPORT_EXCEL_QUERY = "__export-excel-query__",
}

export abstract class BaseChannel<T> {
  constructor(private channelType: ChannelType) {}

  abstract getParams(): unknown[];

  public execute(ipcRenderer: IpcRenderer): Promise<T> {
    console.log("do execute on base channel");

    return ipcRenderer.invoke(this.channelType, ...this.getParams());
  }
}
