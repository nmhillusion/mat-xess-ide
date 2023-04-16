import { dialog } from "electron";
import { AppStoreKey } from "../store";
import { ChannelHandler } from "./channel.handler";

export class OpenQueryFileHandler extends ChannelHandler<string[]> {
  async __realEmitEvent(evt: Electron.IpcMainInvokeEvent, ...args: unknown[]) {
    console.log("[handler] OpenQueryFileHandler");

    const result = await dialog.showOpenDialog(this.mainWindow, {
      title: "Select query file",
      filters: [
        {
          extensions: ["sql"],
          name: "SQL File",
        },
      ],
    });

    ChannelHandler.appStoreInstance.set(
      AppStoreKey.SELECTED_DATABASE,
      String(result.filePaths)
    );

    return result.filePaths;
  }
}
