/// <reference path="../frontend/types/window.d.ts" />

import { contextBridge, ipcRenderer } from "electron";
import { QuerySqlChannel } from "./share/channel/query-sql.channel";
import { SelectFileChannel } from "./share/channel/select-file.channel";
import { GetStoreValueChannel } from "./share/channel/get-store-value.channel";
import { AppStoreKey } from "./store";

contextBridge.exposeInMainWorld("electronAPI", {
  async querySql(sql: string) {
    console.log("do query on sql: ", sql);

    const querySqlMessage = new QuerySqlChannel();
    querySqlMessage.setSql(sql);

    const result = await querySqlMessage.execute(ipcRenderer);
    console.log("result sql: ", result);

    return result;
  },
  async selectFile() {
    console.log("do select file");

    const selectFileChannel = new SelectFileChannel();

    return await selectFileChannel.execute(ipcRenderer);
  },
  async getAppStoreValue(key_) {
    console.log(`do getAppStoreValue(key_ = ${key_})`);

    const getAppStoreChannel = new GetStoreValueChannel();
    getAppStoreChannel.setStoreKey(AppStoreKey.SELECTED_DATABASE);

    return await getAppStoreChannel.execute(ipcRenderer);
  },
} as ElectronApi);
