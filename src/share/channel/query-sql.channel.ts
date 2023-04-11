/// <reference path="../types/ms-access-result.d.ts" />

import { BaseChannel, ChannelType } from "./base.channel";

export class QuerySqlChannel extends BaseChannel<MsAccessResult> {
  private sql: string;

  constructor() {
    super(ChannelType.QUERY_SQL);
  }

  setSql(sql: string) {
    if (sql) {
      this.sql = sql;
    }
  }

  getParams(): any[] {
    return [this.sql];
  }
}
