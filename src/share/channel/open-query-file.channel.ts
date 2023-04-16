import { BaseChannel, ChannelType } from "./base.channel";

export class SelectMsDatabaseFileChannel extends BaseChannel<string> {
  constructor() {
    super(ChannelType.OPEN_QUERY_FILE);
  }

  getParams(): unknown[] {
    return [];
  }
}
