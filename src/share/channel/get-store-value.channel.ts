import { BaseChannel, ChannelType } from "./base.channel";

export class GetStoreValueChannel extends BaseChannel<string> {
  private storeKey: string;

  constructor() {
    super(ChannelType.GET_STORE_VALUE);
  }

  setStoreKey(storeKey: string) {
    this.storeKey = storeKey;
  }

  getParams(): unknown[] {
    return [this.storeKey];
  }
}
