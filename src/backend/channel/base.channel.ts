export enum ChannelType {
  QUERY_SQL = "__query-sql__",
  SELECT_FILE = "__select-file__",
}

export abstract class BaseChannel {
  constructor(private channelType: ChannelType) {}

  abstract getParams(): any[];

  public execute(ipcRenderer: Electron.IpcRenderer) {
    console.log("do execute on base channel");

    return ipcRenderer.invoke(this.channelType, ...this.getParams());
  }
}
