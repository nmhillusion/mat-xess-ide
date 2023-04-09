import { Worksheet, Workbook } from "exceljs";

export class ExcelService {
  private static setForColumnNames(ws_: Worksheet, columnNames: string[]) {
    if (columnNames && Array.isArray(columnNames)) {
      const row_ = ws_.getRow(1);

      for (let colIdx = 0; colIdx < columnNames.length; ++colIdx) {
        const cell_ = row_.getCell(colIdx + 1);
        cell_.value = columnNames[colIdx];
        cell_.style.font = { bold: true };
      }
    }
  }

  private static setForTableData(ws_: Worksheet, tableData: unknown[][]) {
    if (tableData && Array.isArray(tableData)) {
      for (let rowIdx = 0; rowIdx < tableData.length; ++rowIdx) {
        const rowData = tableData[rowIdx];
        ws_.addRow(rowData);
      }
    }
  }

  static export(
    accResult: MsAccessResult,
    outputFilePath: string,
    sheetName: string = "Sheet1"
  ) {
    const wb_ = new Workbook();
    const ws_: Worksheet = wb_.addWorksheet(sheetName);

    this.setForColumnNames(ws_, accResult.columnNames);
    this.setForTableData(ws_, accResult.tableData);

    wb_.xlsx.writeFile(outputFilePath);

    console.log("Save excel to ", outputFilePath);
  }
}
