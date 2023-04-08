import { BaseChannel, ChannelType } from "./base.channel";

export class SelectFileChannel extends BaseChannel {
  constructor() {
    super(ChannelType.SELECT_FILE);
  }

  getParams(): any[] {
    return [];
  }
}
