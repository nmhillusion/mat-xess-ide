/// <reference path="../../../node_modules/monaco-editor/monaco.d.ts" />

let editor: monaco.editor.IStandaloneCodeEditor;

function mainController() {
  const matXessIdeEl = document.getElementById("matXessIDE");
  if (!matXessIdeEl) {
    throw new Error("Cannot find matXessIDEEl");
  }

  editor = monaco.editor.create(matXessIdeEl, {
    value: `
      select *
      from acevnprd2.t_user tu
      where tu.user_name = '0081188'
    `,
    language: "sql",
  });

  console.log({ editor });
}

function getValue() {
  return editor?.getValue();
}
