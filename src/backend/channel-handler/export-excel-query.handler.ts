import { dialog } from "electron";
import { ExcelService } from "../service/excel.service";
import { doQueryDatabase } from "../service/msaccess-querier.service";
import { AppStoreKey } from "../store";
import { ChannelHandler } from "./channel.handler";

export class ExportExcelQueryHandler extends ChannelHandler<boolean> {
  async __realEmitEvent(evt: Electron.IpcMainInvokeEvent, ...args: unknown[]) {
    console.log("[handler] `ExportExcelQuery` on: ", args);

    const [query_] = args;

    if (!query_) {
      throw new Error("Query is empty.");
    }

    const outputFilePath = await dialog.showSaveDialog(this.mainWindow, {
      title: "Export excel",
      filters: [
        {
          name: "Excel",
          extensions: ["xlsx"],
        },
      ],
    });

    if (outputFilePath.canceled || !outputFilePath.filePath) {
      throw new Error("Empty output file path");
    }

    const wrapperSql = String(query_);

    console.log("[handler] wrapper sql: ", wrapperSql);

    const msAccessResult = doQueryDatabase(
      ChannelHandler.appStoreInstance.get(AppStoreKey.SELECTED_DATABASE),
      wrapperSql
    );

    ExcelService.export(msAccessResult, outputFilePath.filePath);

    dialog.showMessageBox(this.mainWindow, {
      message: `Export result to excel file: ${outputFilePath.filePath}`,
      title: "Success",
    });

    return true;
  }
}
