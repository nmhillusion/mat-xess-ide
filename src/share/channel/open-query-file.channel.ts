import { BaseChannel, ChannelType } from "./base.channel";

export class OpenQueryFileChannel extends BaseChannel<string> {
  constructor() {
    super(ChannelType.OPEN_QUERY_FILE);
  }

  getParams(): unknown[] {
    return [];
  }
}
