/// <reference path="../../../node_modules/monaco-editor/monaco.d.ts" />
/// <reference path="../types/window.d.ts" />
/// <reference path="../types/require.d.ts" />
/// <reference path="../types/ms-access-result.d.ts" />
/// <reference path="../common/environment.model.ts" />

import { envConfig } from "../common/environment";

let editor: monaco.editor.IStandaloneCodeEditor;

const STATE: {
  spentTime: number;
  executingQuery: boolean;
  resultData?: MsAccessResult;
} = {
  spentTime: 0,
  executingQuery: false,
};

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
    automaticLayout: true,
  });

  console.log({ editor });
}

function getQueryValue() {
  return editor?.getValue();
}

async function updateUI() {
  updateConnectionStatus();
  await updateResultPanel();
  updateExecutionStatus();
}

async function updateConnectionStatus() {
  const connectionStatusEl = document.querySelector(
    "#connectedStatus"
  ) as HTMLDivElement;

  const selectedDatabase = await window.electronAPI.getAppStoreValue(
    "$SELECTED_DATABASE_"
  );

  console.log("updateUI()", { selectedDatabase });

  if (connectionStatusEl) {
    if (selectedDatabase) {
      const connectedDatabaseName = connectionStatusEl?.querySelector(
        ".databaseName#databaseName"
      );

      connectionStatusEl.style.display = "block";

      if (connectedDatabaseName) {
        connectedDatabaseName.textContent = String(selectedDatabase);
      }
    } else {
      connectionStatusEl.style.display = "none";
    }
  }
}

function clearChildrenEls(parentEl: Element) {
  if (parentEl) {
    while (parentEl.firstChild) {
      parentEl.firstChild.remove();
    }
  }
}

function updateResultPanel() {
  const resultPanel = document.querySelector(".result-panel") as HTMLDivElement;

  if (!STATE.resultData || 0 == STATE.resultData?.tableData?.length) {
    resultPanel.style.display = "none";
  } else {
    resultPanel.style.display = "block";

    const resultContainer = resultPanel.querySelector(".result-container");
    const columnNamesEl = resultContainer?.querySelector("#columnNames");
    const tableDataEl = resultContainer?.querySelector("#tableData");
    const spendTimeEl = resultPanel.querySelector(".spend-time");

    if (!columnNamesEl || !tableDataEl || !spendTimeEl) {
      throw new Error("Not found result elements");
    }

    clearChildrenEls(columnNamesEl);
    clearChildrenEls(tableDataEl);

    for (const columnName of STATE.resultData.columnNames) {
      const columnNameTd = document.createElement("th");
      columnNameTd.textContent = columnName;
      columnNamesEl.appendChild(columnNameTd);
    }

    for (const row_ of STATE.resultData.tableData) {
      const rowEl = document.createElement("tr");
      for (const cell_ of row_) {
        const cellEl = document.createElement("td");

        cellEl.textContent = String(cell_);

        rowEl.appendChild(cellEl);
      }
      tableDataEl.appendChild(rowEl);
    }

    spendTimeEl.textContent = `Executed in ${
      STATE.spentTime / 1000
    } seconds. (Only fetch first ${
      envConfig.processEnv.recordsOnView
    } records)`;
  }
}

function updateExecutionStatus() {
  const btnExecQuery = document.querySelector(
    "#execQuery"
  ) as HTMLButtonElement;
  const loadingSpinEl = document.querySelector("#loading") as HTMLElement;

  if (STATE.executingQuery) {
    btnExecQuery.style.display = "none";
    loadingSpinEl.style.display = "block";
  } else {
    btnExecQuery.style.display = "block";
    loadingSpinEl.style.display = "none";
  }
}

(function main() {
  {
    require.config({
      paths: { vs: "../../../node_modules/monaco-editor/min/vs" },
    });

    require(["vs/editor/editor.main"], mainController);
  }

  {
    const btnDatabase = document.querySelector(
      "#btnSelectDatabase"
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
    btnExecQuery.onclick = async (_) => {
      STATE.executingQuery = true;
      updateUI();
      const startTime = new Date();

      const queryValue = getQueryValue();

      console.log("will execute on ", queryValue);

      const result = await window.electronAPI.querySql(queryValue);
      console.log("result of query is: ", result);

      STATE.resultData = result;
      STATE.executingQuery = false;
      STATE.spentTime = new Date().getTime() - startTime.getTime();
      updateUI();
    };
  }

  updateUI();
})();
