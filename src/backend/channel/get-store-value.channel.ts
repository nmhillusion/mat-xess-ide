import { BaseChannel, ChannelType } from "./base.channel";

export class GetStoreValueChannel extends BaseChannel {
  private storeKey: string;

  constructor() {
    super(ChannelType.GET_STORE_VALUE);
  }

  setStoreKey(storeKey: string) {
    this.storeKey = storeKey;
  }

  getParams(): any[] {
    return [this.storeKey];
  }
}
