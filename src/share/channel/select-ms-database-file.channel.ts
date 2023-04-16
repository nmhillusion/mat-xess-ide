import { BaseChannel, ChannelType } from "./base.channel";

export class SelectMsDatabaseFileChannel extends BaseChannel<string> {
  constructor() {
    super(ChannelType.SELECT_MS_DATABASE_FILE);
  }

  getParams(): unknown[] {
    return [];
  }
}
