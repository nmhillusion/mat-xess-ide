import { dialog } from "electron";

import * as fs from "fs";
import { ChannelHandler } from "./channel.handler";

export class OpenQueryFileHandler extends ChannelHandler<{
  fileName: string;
  fileContent: string;
}> {
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

    if (result.canceled || !result.filePaths) {
      throw new Error(" Not select a query file ");
    }
    console.log("select query file: ", result.filePaths);

    const selectedQueryFile = String(result.filePaths);

    return {
      fileName: selectedQueryFile,
      fileContent: fs.readFileSync(selectedQueryFile).toString(),
    };
  }
}
