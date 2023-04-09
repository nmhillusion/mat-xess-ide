import { app } from "electron";
import * as fs from "fs";
import path from "path";

export enum AppStoreKey {
  SELECTED_DATABASE = "$SELECTED_DATABASE_",
}

export class AppStore {
  private _currentAppPath: string;
  private _currentAppStoreFilePath: string;

  constructor(private readonly app: Electron.App) {
    const appDataPath = this.app.getPath("appData");
    this._currentAppPath = path.resolve(appDataPath, "matXessIde");

    if (!fs.existsSync(this._currentAppPath)) {
      fs.mkdirSync(this._currentAppPath, { recursive: true });
    }

    this._currentAppStoreFilePath = path.resolve(
      this._currentAppPath,
      "store.json"
    );

    if (!fs.existsSync(this._currentAppStoreFilePath)) {
      fs.writeFileSync(this._currentAppStoreFilePath, "{}");
    }

    console.log("_currentAppPath : ", this._currentAppPath);
    console.log("_currentAppStoreFilePath : ", this._currentAppStoreFilePath);
  }

  private readAppStore() {
    return JSON.parse(
      fs.readFileSync(this._currentAppStoreFilePath).toString()
    );
  }

  get(key_: string) {
    const currentStore = this.readAppStore();

    console.log({ currentStore });

    return currentStore[key_];
  }

  set(key_: string, value_: string) {
    const currentStore = this.readAppStore();
    currentStore[key_] = value_;

    fs.writeFileSync(
      this._currentAppStoreFilePath,
      JSON.stringify(currentStore)
    );
  }
}
