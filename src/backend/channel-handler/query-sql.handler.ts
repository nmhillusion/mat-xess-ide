import { doQueryDatabase } from "../service/msaccess-querier.service";
import { AppStoreKey } from "../store";
import { ChannelHandler } from "./channel.handler";

export class QuerySqlHandler extends ChannelHandler {
  handler(evt: Electron.IpcMainInvokeEvent, ...args: unknown[]) {
    console.log("[handler] query sql on: ", args);

    const [query_] = args;

    const wrapperSql = `
      select top ${ChannelHandler.MAX_RECORDS} *
      from (
        ${String(query_)}
      )
    `;

    console.log("[handler] wrapper sql: ", wrapperSql);

    const msAccessResult = doQueryDatabase(
      ChannelHandler.appStoreInstance.get(AppStoreKey.SELECTED_DATABASE),
      wrapperSql
    );

    return msAccessResult;
  }
}
