// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { ChannelType } from "./channel/base.channel";
import { AppStore, AppStoreKey } from "./store";
import { doQueryDatabase } from "./service/msaccess-querier.service";
import { envConfig } from "./environment";
import { ExcelService } from "./service/excel.service";

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

  const appStore = new AppStore(app);
  handleChannels(app, appStore);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function handleChannels(app: Electron.App, appStore: AppStore) {
  ipcMain.handle(ChannelType.GET_STORE_VALUE, (evt, ...args) => {
    console.log("main handle `get store value` on: ", args);

    const [storeKey] = args;

    const result = appStore.get(storeKey);

    console.log(`get store value [${storeKey}] = ${result}`);

    return result;
  });

  ipcMain.handle(ChannelType.QUERY_SQL, (evt, ...args) => {
    console.log("main handle query sql on: ", args);

    const [query_] = args;

    const msAccessResult = doQueryDatabase(
      appStore.get(AppStoreKey.SELECTED_DATABASE),
      query_
    );

    ExcelService.export(msAccessResult, path.resolve(__dirname, "test.xlsx"));

    return msAccessResult;
  });

  ipcMain.handle(ChannelType.SELECT_FILE, async (evt, args) => {
    console.log("main handle select file");

    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Select MS Access Database",
      filters: [
        {
          extensions: ["accdb"],
          name: "MS Access File",
        },
      ],
    });

    appStore.set(AppStoreKey.SELECTED_DATABASE, String(result.filePaths));

    return result.filePaths;
  });
}
