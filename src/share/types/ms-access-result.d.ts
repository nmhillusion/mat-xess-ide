interface MsAccessResult {
  sqlQuery: string;
  spentTime: number;
  columnNames: string[];
  tableData: unknown[][];
}
