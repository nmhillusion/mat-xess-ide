// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { ChannelType } from "./channel/base.channel";

let mainWindow: BrowserWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../frontend/home/index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
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
  ipcMain.handle(ChannelType.QUERY_SQL, (evt, args) => {
    console.log("main handle query sql on: ", args);

    return {
      result: "result query in here",
    };
  });

  ipcMain.handle(ChannelType.SELECT_FILE, async (evt, args) => {
    console.log("main handle select file");

    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Select Ms Access Database",
      filters: [
        {
          extensions: ["accdb"],
          name: "MS Access File",
        },
      ],
    });

    return result.filePaths;
  });
}
