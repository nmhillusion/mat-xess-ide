/// <reference path="../../../node_modules/monaco-editor/monaco.d.ts" />
/// <reference path="../types/window.d.ts" />
/// <reference path="../types/require.d.ts" />
/// <reference path="../common/share/types/ms-access-result.d.ts" />
/// <reference path="../common/share/environment/environment.model.ts" />

import { envConfig } from "../common/share/environment/environment";

let editor: monaco.editor.IStandaloneCodeEditor;

const STATE: {
  executingQuery: boolean;
  resultData?: MsAccessResult[];
} = {
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

function getQueryAll() {
  return editor?.getValue();
}

function getQuerySelection() {
  const selection_ = editor?.getSelection();

  const allLines = getQueryAll()
    .split("\n")
    .map((str_) => str_.trim());

  const start_ = selection_?.getStartPosition();
  const end_ = selection_?.getEndPosition();

  console.log({ start_, end_ });

  const selectedLines: string[] = [];
  for (let colIdx = 0; colIdx < allLines.length; ++colIdx) {
    const colNum = colIdx + 1;

    if (colNum == (start_?.lineNumber || 0)) {
      selectedLines.push(allLines[colIdx].substring(start_?.column || 0));
    }

    if (
      colNum > (start_?.lineNumber || 0) ||
      colNum < (end_?.lineNumber || 0)
    ) {
      selectedLines.push(allLines[colIdx]);
    }

    if (colNum == (end_?.lineNumber || 0)) {
      selectedLines.push(allLines[colIdx].substring(0, end_?.column || -1));
    }
  }

  return selectedLines.join("\n");
}

async function updateUI(
  onlyUpdateSpecificElements:
    | {
        connectionStatus?: boolean;
        executionStatus?: boolean;
        resultStatus?: boolean;
      }
    | undefined = undefined
) {
  if (
    !onlyUpdateSpecificElements ||
    onlyUpdateSpecificElements.connectionStatus
  ) {
    updateConnectionStatus();
  }

  if (
    !onlyUpdateSpecificElements ||
    onlyUpdateSpecificElements.executionStatus
  ) {
    updateExecutionStatus();
  }

  if (!onlyUpdateSpecificElements || onlyUpdateSpecificElements.resultStatus) {
    updateResultPanel();
  }
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

function buildForResultTabPanel(
  resultPanel_: HTMLElement,
  queryResult: MsAccessResult
) {
  const resultTabPagesEl = resultPanel_.querySelector(".result-tab-pages");
  const resultTabNodesEl = resultPanel_.querySelector(".result-tab-nodes");
  const tabNodeExample = resultTabNodesEl?.querySelector("#tabNodeExample");
  const tabPageExample = resultTabPagesEl?.querySelector("#tabPageExample");
  let resultPageEl: HTMLElement;
  let tabNodeEl: HTMLElement;

  buildTabPage();
  buildTabNode();

  function buildTabNode() {
    const cloneTabNode_ = tabNodeExample?.cloneNode(true);
    if (cloneTabNode_) {
      resultTabNodesEl?.appendChild(cloneTabNode_);
    } else {
      throw new Error("Cannot clone node cloneTabNode_");
    }

    tabNodeEl = cloneTabNode_ as HTMLElement;
    tabNodeEl.classList.add("real-tab-node");
    tabNodeEl.style.display = "block";
    tabNodeEl.removeAttribute("id");

    tabNodeEl.textContent = queryResult.sqlQuery
      .trim()
      .substring(0, 20)
      .replace(/\W/g, "_");

    tabNodeEl.onclick = (_) => {
      {
        const tabNodeEls = resultTabNodesEl?.querySelectorAll(".real-tab-node");
        if (tabNodeEls) {
          for (const el_ of tabNodeEls) {
            (el_ as HTMLElement).classList.remove("selected");
          }
        }
      }
      tabNodeEl.classList.add("selected");

      {
        const tabPageEls = resultTabPagesEl?.querySelectorAll(".real-tab-page");
        if (tabPageEls) {
          for (const el_ of tabPageEls) {
            (el_ as HTMLElement).style.display = "none";
          }
        }
      }

      if (resultPageEl) {
        resultPageEl.style.display = "block";
      }
    };
  }

  function buildTabPage() {
    const cloneTabPageNode_ = tabPageExample?.cloneNode(true);
    if (cloneTabPageNode_) {
      resultTabPagesEl?.appendChild(cloneTabPageNode_);
    } else {
      throw new Error("Cannot clone node cloneTabPageNode_");
    }

    resultPageEl = cloneTabPageNode_ as HTMLElement;
    resultPageEl.classList.add("real-tab-page");
    resultPageEl.removeAttribute("id");

    const resultContainer = resultPageEl.querySelector(".result-container");
    const columnNamesEl = resultContainer?.querySelector(".columnNames");
    const tableDataEl = resultContainer?.querySelector(".tableData");
    const spendTimeEl = resultPageEl.querySelector(".spend-time");
    const sqlQueryEl = resultPageEl.querySelector(".sql-query");
    const btnExportExcel: HTMLButtonElement | null =
      resultPageEl.querySelector(".btnExportExcel");

    if (
      !columnNamesEl ||
      !tableDataEl ||
      !spendTimeEl ||
      !sqlQueryEl ||
      !btnExportExcel
    ) {
      throw new Error("Not found result elements");
    }

    console.log({ queryResult });

    sqlQueryEl.textContent = queryResult.sqlQuery;

    for (const columnName of queryResult.columnNames) {
      const columnNameTd = document.createElement("th");
      columnNameTd.textContent = columnName;
      columnNamesEl.appendChild(columnNameTd);
    }

    for (const row_ of queryResult.tableData) {
      const rowEl = document.createElement("tr");
      for (const cell_ of row_) {
        const cellEl = document.createElement("td");

        cellEl.textContent = String(cell_);

        rowEl.appendChild(cellEl);
      }
      tableDataEl.appendChild(rowEl);
    }

    spendTimeEl.textContent = `Executed in ${
      queryResult.spentTime / 1000
    } seconds. (Only fetch first ${
      envConfig.processEnv.recordsOnView
    } records)`;

    __registerForExportExcelQuery(btnExportExcel, queryResult.sqlQuery);
  }
}

function updateResultPanel() {
  const resultPanel = document.querySelector(".result-panel") as HTMLDivElement;

  if (!STATE.resultData || 0 == STATE.resultData?.length) {
    resultPanel.style.display = "none";
  } else {
    const oldElements = resultPanel.querySelectorAll(
      ".real-tab-node,.real-tab-page"
    );
    for (const oldEl_ of oldElements) {
      oldEl_.remove();
    }

    resultPanel.style.display = "block";

    for (const result_ of STATE.resultData) {
      buildForResultTabPanel(resultPanel, result_);
    }

    (resultPanel.querySelector(".real-tab-node") as HTMLButtonElement)?.click();
  }
}

function updateExecutionStatus() {
  const btnExecBoxQuery = document.querySelector(
    ".execute-box .button-box"
  ) as HTMLElement;
  const loadingSpinEl = document.querySelector("#loading") as HTMLElement;

  if (STATE.executingQuery) {
    btnExecBoxQuery.style.display = "none";
    loadingSpinEl.style.display = "block";
  } else {
    btnExecBoxQuery.style.display = "block";
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

  __registerForExecuteAllQuery();

  __registerForExecuteSelectionQuery();

  __registerForOpenQueryFile();

  updateUI();
})();

function __registerForExecuteAllQuery() {
  const btnExecQuery = document.querySelector(
    "#execQuery"
  ) as HTMLButtonElement;
  btnExecQuery.onclick = async (_) => {
    STATE.executingQuery = true;
    updateUI();
    const queryValue = getQueryAll();

    console.log("will execute on ", queryValue);

    const result = await window.electronAPI.querySql(queryValue);
    console.log("result of query is: ", result);

    STATE.resultData = result;
    STATE.executingQuery = false;
    updateUI();
  };
}

function __registerForExportExcelQuery(
  btnExportExcel: HTMLButtonElement,
  sqlQuery_: string
) {
  btnExportExcel.onclick = async (_) => {
    STATE.executingQuery = true;
    updateUI({
      executionStatus: true,
    });
    const queryValue = sqlQuery_;

    if (!queryValue) {
      throw new Error("query is empty");
    }

    console.log("will execute on ", queryValue);

    await window.electronAPI.exportExcelQuery(queryValue);

    STATE.executingQuery = false;
    updateUI({
      executionStatus: true,
    });
  };
}

function __registerForOpenQueryFile() {
  const btnOpenQueryFile = document.querySelector(
    "#btnOpenQueryFile"
  ) as HTMLButtonElement;

  btnOpenQueryFile.onclick = async (_) => {
    const { fileContent, fileName } = await window.electronAPI.openQueryFile();

    console.log({ fileContent, fileName });

    editor.setValue(fileContent);

    updateUI();
  };
}
function __registerForExecuteSelectionQuery() {
  const btnExecQuery = document.querySelector(
    "#execQuerySelection"
  ) as HTMLButtonElement;
  btnExecQuery.onclick = async (_) => {
    STATE.executingQuery = true;
    updateUI();
    const queryValue = getQuerySelection();

    console.log("will execute on ", queryValue);

    // const result = await window.electronAPI.querySql(queryValue);
    // console.log("result of query is: ", result);

    // STATE.currentSqlQuery = queryValue[0];
    // STATE.resultData = result;
    STATE.executingQuery = false;
    updateUI();
  };
}
