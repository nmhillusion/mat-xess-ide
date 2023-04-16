import { BaseChannel, ChannelType } from "./base.channel";

export class ExportExcelQueryChannel extends BaseChannel<void> {
  private query: string;

  constructor() {
    super(ChannelType.EXPORT_EXCEL_QUERY);
  }

  setQuery(query: string) {
    this.query = query;
  }

  getParams(): unknown[] {
    return [this.query];
  }
}
