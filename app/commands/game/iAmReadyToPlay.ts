import {
  getKpashiTable,
  saveKpashiTable
} from "../../repositories/kpashiTableRepo";
import { KpashiTable } from "./../../domain/kpashiTable";
import { getUserInfo } from "../../queries/getUserInfo";
import { getTableInfo } from "../../queries/getTableInfo";
import { raiseIAmReadyToPlayEvent } from "../../domainevents/gameEvents";
export async function iAmReadyToPlay(tableid: string, userid: string) {
  var table: KpashiTable = await getKpashiTable(tableid);
  var userinfo: any = await getUserInfo(userid);
  table.setReadinessToPlay(userid);
  await saveKpashiTable(table);
  var tableinfo = await getTableInfo(tableid);
  raiseIAmReadyToPlayEvent(tableinfo, userinfo);
}
