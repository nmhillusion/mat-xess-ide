import { dialog } from "electron";
import { AppStoreKey } from "../store";
import { ChannelHandler } from "./channel.handler";

export class SelectFileHandler extends ChannelHandler {
  async handler(evt: Electron.IpcMainInvokeEvent, ...args: unknown[]) {
    console.log("[handler] select file");

    const result = await dialog.showOpenDialog(this.mainWindow, {
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