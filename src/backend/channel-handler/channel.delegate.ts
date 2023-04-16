import { BrowserWindow } from "electron";
import { ChannelType } from "../share/channel/base.channel";
import { ChannelHandler } from "./channel.handler";
import { GetStoreValueHandler } from "./get-store-value.handler";
import { QuerySqlHandler } from "./query-sql.handler";
import { SelectFileHandler } from "./select-file.handler";
import { ExportExcelQueryHandler } from "./export-excel-query.handler";

export class ChannelDelegate {
  private readonly MAPPING_HANDLER: { [key: string]: ChannelHandler<any> } = {};

  constructor(app: Electron.App, mainWindow: BrowserWindow) {
    this.MAPPING_HANDLER = {
      [ChannelType.GET_STORE_VALUE]: new GetStoreValueHandler(app, mainWindow),
      [ChannelType.QUERY_SQL]: new QuerySqlHandler(app, mainWindow),
      [ChannelType.SELECT_FILE]: new SelectFileHandler(app, mainWindow),
      [ChannelType.EXPORT_EXCEL_QUERY]: new ExportExcelQueryHandler(
        app,
        mainWindow
      ),
    };
  }

  handle(channelType: ChannelType) {
    if (this.MAPPING_HANDLER[channelType]) {
      return this.MAPPING_HANDLER[channelType];
    }

    console.log("== [cannot find available handler] ====");
  }
}
