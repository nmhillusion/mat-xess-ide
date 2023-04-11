import { BrowserWindow } from "electron";
import { ChannelType } from "../share/channel/base.channel";
import { ChannelHandler } from "./channel.handler";
import { GetStoreValueHandler } from "./get-store-value.handler";
import { QuerySqlHandler } from "./query-sql.handler";
import { SelectFileHandler } from "./select-file.handler";

export class ChannelDelegate {
  private readonly MAPPING_HANDLER: { [key: string]: ChannelHandler } = {};

  constructor(app: Electron.App, mainWindow: BrowserWindow) {
    this.MAPPING_HANDLER = {
      [ChannelType.GET_STORE_VALUE]: new GetStoreValueHandler(app, mainWindow),
      [ChannelType.QUERY_SQL]: new QuerySqlHandler(app, mainWindow),
      [ChannelType.SELECT_FILE]: new SelectFileHandler(app, mainWindow),
    };
  }

  invoke(channelType: ChannelType) {
    if (this.MAPPING_HANDLER[channelType]) {
      return this.MAPPING_HANDLER[channelType];
    }

    console.log("== [cannot find available handler] ====");
  }
}
