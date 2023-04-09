// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { ChannelType } from "./channel/base.channel";
import { AppStore, AppStoreKey } from "./store";
import { doQueryDatabase } from "./service/msaccess-querier.service";
import { envConfig } from "./environment";
import { ExcelService } from "./service/excel.service";
import { ChannelHandler } from "./channel-handler/channel.handler";

const testing = envConfig.processEnv.testing;
let mainWindow: BrowserWindow = null;

console.log({ testing });

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    darkTheme: true,
    backgroundColor: "#eeeeee",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (!testing) {
    mainWindow.removeMenu();
  }

  mainWindow.loadFile(path.join(__dirname, "../frontend/home/index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  handleChannels(app);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function handleChannels(app: Electron.App) {
  const handler = new ChannelHandler(app);

  ipcMain.handle(
    ChannelType.GET_STORE_VALUE,
    handler.HANDLER__GET_STORE_VALUE.bind(handler)
  );

  ipcMain.handle(
    ChannelType.QUERY_SQL,
    handler.HANDLER__QUERY_SQL.bind(handler)
  );

  ipcMain.handle(ChannelType.SELECT_FILE, (evt, ...params) =>
    handler.HANDLER__SELECT_FILE(evt, mainWindow, ...params)
  );
}
