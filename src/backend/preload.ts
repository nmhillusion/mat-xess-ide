/// <reference path="../frontend/types/window.d.ts" />

import { contextBridge, ipcRenderer } from "electron";
import { QuerySqlChannel } from "./share/channel/query-sql.channel";
import { SelectMsDatabaseFileChannel } from "./share/channel/select-ms-database-file.channel";
import { GetStoreValueChannel } from "./share/channel/get-store-value.channel";
import { AppStoreKey } from "./store";
import { ExportExcelQueryChannel } from "./share/channel/export-excel.channel";
import { OpenQueryFileHandler } from "./channel-handler/open-query-file.handler";
import { OpenQueryFileChannel } from "./share/channel/open-query-file.channel";

contextBridge.exposeInMainWorld("electronAPI", {
  async querySql(_sql: string) {
    const resultList = [];
    const subSqlList = _sql.split(";").filter(Boolean);
    for (const subSql of subSqlList) {
      console.log("do query on sql: ", subSql);

      const querySqlMessage = new QuerySqlChannel();
      querySqlMessage.setSql(subSql);

      const result = await querySqlMessage.execute(ipcRenderer);
      console.log("result sql: ", result);

      resultList.push(result);
    }
    return resultList;
  },
  async selectFile() {
    console.log("do select file");

    const selectFileChannel = new SelectMsDatabaseFileChannel();

    return await selectFileChannel.execute(ipcRenderer);
  },
  async getAppStoreValue(key_) {
    console.log(`do getAppStoreValue(key_ = ${key_})`);

    const getAppStoreChannel = new GetStoreValueChannel();
    getAppStoreChannel.setStoreKey(AppStoreKey.SELECTED_DATABASE);

    return await getAppStoreChannel.execute(ipcRenderer);
  },

  async exportExcelQuery(sql: string): Promise<void> {
    console.log(`do exportExcelQuery(sql = ${sql})`);

    const channel_ = new ExportExcelQueryChannel();
    channel_.setQuery(sql);
    await channel_.execute(ipcRenderer);
  },
  async openQueryFile(): Promise<{
    fileName: string;
    fileContent: string;
  }> {
    console.log(`do openQueryFile()`);

    const channel_ = new OpenQueryFileChannel();
    return await channel_.execute(ipcRenderer);
  },
} as ElectronApi);
