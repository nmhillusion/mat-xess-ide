import { ChannelHandler } from "./channel.handler";

export class GetStoreValueHandler extends ChannelHandler<string> {
  async __realEmitEvent(evt: Electron.IpcMainInvokeEvent, ...args: unknown[]) {
    console.log("[handler] `get store value` on: ", args);

    const [storeKey] = args;

    const result = ChannelHandler.appStoreInstance.get(String(storeKey));

    console.log(`get store value [${storeKey}] = ${result}`);

    return result;
  }
}
