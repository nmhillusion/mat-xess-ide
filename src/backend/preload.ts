/// <reference path="../frontend/types/window.d.ts" />

import { contextBridge, ipcRenderer } from "electron";
import { QuerySqlChannel } from "./channel/query-sql.channel";
import { SelectFileChannel } from "./channel/select-file.channel";

contextBridge.exposeInMainWorld("electronAPI", {
  async querySql(sql: string) {
    console.log("do query on sql: ", sql);

    const querySqlMessage = new QuerySqlChannel();
    querySqlMessage.setSql("select * from t_user where id = 2");

    const result = await querySqlMessage.execute(ipcRenderer);
    console.log("result sql: ", result);
  },
  async selectFile() {
    console.log("do select file");

    const selectFileChannel = new SelectFileChannel();
    const result = await selectFileChannel.execute(ipcRenderer);

    return result;
  },
} as ElectronApi);

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
