// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { ChannelType } from "./share/channel/base.channel";
import { ChannelDelegate } from "./channel-handler/channel.delegate";
import { envConfig } from "./share/environment/environment";

const testing = envConfig.processEnv.testing;
let mainWindow: BrowserWindow = null;

console.log({ testing, e_: process.env.MODE });

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
  const channelDelegate = new ChannelDelegate(app, mainWindow);

  ipcMain.handle(ChannelType.GET_STORE_VALUE, (evt, ...args) =>
    channelDelegate.invoke(ChannelType.GET_STORE_VALUE).handler(evt, ...args)
  );

  ipcMain.handle(ChannelType.QUERY_SQL, (evt, ...args) =>
    channelDelegate.invoke(ChannelType.QUERY_SQL).handler(evt, ...args)
  );

  ipcMain.handle(ChannelType.SELECT_FILE, (evt, ...args) =>
    channelDelegate.invoke(ChannelType.SELECT_FILE).handler(evt, ...args)
  );

  ipcMain.handle(ChannelType.EXPORT_EXCEL_QUERY, (evt, ...args) =>
    channelDelegate.invoke(ChannelType.EXPORT_EXCEL_QUERY).handler(evt, ...args)
  );
}
