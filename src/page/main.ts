/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />

let editor: monaco.editor.IStandaloneCodeEditor;

function mainController() {
  editor = monaco.editor.create(document.getElementById("matXessIDE"), {
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
