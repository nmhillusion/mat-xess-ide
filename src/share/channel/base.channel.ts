import { IpcRenderer } from "electron";

export enum ChannelType {
  QUERY_SQL = "__query-sql__",
  SELECT_FILE = "__select-file__",
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
