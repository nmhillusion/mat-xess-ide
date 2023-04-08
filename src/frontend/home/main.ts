/// <reference path="../../../node_modules/monaco-editor/monaco.d.ts" />
/// <reference path="../types/window.d.ts" />
/// <reference path="../types/require.d.ts" />

let editor: monaco.editor.IStandaloneCodeEditor;

function mainController() {
  const matXessIdeEl = document.getElementById("matXessIDE");
  if (!matXessIdeEl) {
    throw new Error("Cannot find matXessIDEEl");
  }

  editor = monaco.editor.create(matXessIdeEl, {
    value: `
      select *
      from t_user tu
      where tu.id = 1
    `,
    language: "sql",
  });

  console.log({ editor });
}

function getValue() {
  return editor?.getValue();
}

async function updateUI() {
  const connectionStatusEl = document.querySelector(
    "#connectedStatus"
  ) as HTMLDivElement;
  const connectedDatabaseName = connectionStatusEl?.querySelector(
    ".databaseName#databaseName"
  );

  const selectedDatabase = await window.electronAPI.getAppStoreValue(
    "$SELECTED_DATABASE_"
  );

  console.log("updateUI()", { selectedDatabase });

  if (connectionStatusEl) {
    if (selectedDatabase) {
      connectionStatusEl.style.display = "block";

      if (connectedDatabaseName) {
        connectedDatabaseName.textContent = String(selectedDatabase);
      }
    } else {
      connectionStatusEl.style.display = "none";
    }
  }
}

(function main() {
  require.config({
    paths: { vs: "../../../node_modules/monaco-editor/min/vs" },
  });

  require(["vs/editor/editor.main"], mainController);

  {
    const btnDatabase = document.querySelector(
      "#database-file"
    ) as HTMLButtonElement;

    btnDatabase.onclick = async (_) => {
      const selectedFile = await window.electronAPI.selectFile();

      console.log({ selectedFile });

      updateUI();
    };
  }

  {
    const btnExecQuery = document.querySelector(
      "#execQuery"
    ) as HTMLButtonElement;
    btnExecQuery.onclick = (_) => {
      const queryValue = getValue();

      console.log("will execute on ", queryValue);

      const result = window.electronAPI.querySql(queryValue);
      console.log("result of query is: ", result);
    };
  }

  updateUI();
})();
