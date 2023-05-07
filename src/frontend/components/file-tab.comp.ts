/// <reference path="../../../node_modules/monaco-editor/monaco.d.ts" />

import { AppState } from "../home/main";

export interface FileTabConfig {
  element_: HTMLElement;
  fileName_: string;
  fileContent_: string;
  ideEditor: monaco.editor.IStandaloneCodeEditor;
  appState: AppState;
  onClickExitFn?: (() => void) | undefined;
}

export class FileTabComponent {
  constructor(private tabConfig: FileTabConfig) {
    console.log("init for file tab of ", tabConfig.fileName_);

    const textEl = tabConfig.element_.querySelector(".text");
    const btnExit = tabConfig.element_.querySelector(
      ".btn-exit"
    ) as HTMLButtonElement;

    if (!textEl || !btnExit) {
      throw new Error(
        "Cannot found text element and/or button exit of this file tab: " +
          tabConfig.fileName_
      );
    }

    this.tabConfig = tabConfig;

    btnExit.onclick = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (tabConfig.onClickExitFn) {
        tabConfig.onClickExitFn.call(this);
      }
    };

    textEl.textContent = tabConfig.fileName_;

    tabConfig.element_.onclick = (_) => {
      _.preventDefault();
      _.stopPropagation();

      this.openTab();
    };

    this.tabConfig.ideEditor.setBanner(tabConfig.element_, 50);
  }

  public get element() {
    return this.tabConfig.element_;
  }

  public get fileName() {
    return this.tabConfig.fileName_;
  }

  openTab() {
    this.tabConfig.ideEditor.setValue(this.tabConfig.fileContent_);
    this.tabConfig.appState.currectOpenningFileTab = this.tabConfig.fileName_;
  }
}
