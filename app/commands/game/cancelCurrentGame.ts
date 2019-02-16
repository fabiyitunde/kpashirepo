import {
  getKpashiGame,
  saveKpashiGame
} from "../../repositories/kpashiGameRepo";
import { KpashiGame } from "../../domain/kpashiGame";
import {
  getKpashiTable,
  saveKpashiTable
} from "../../repositories/kpashiTableRepo";
import { KpashiTable } from "../../domain/kpashiTable";
import { getUserInfo } from "../../queries/getUserInfo";
import { getTableInfo } from "../../queries/getTableInfo";
import { raiseCurrentGameCancelledEvent } from "../../domainevents/gameEvents";
export async function cancelCurrentGame(tableid: string, userid: string) {
  var table: KpashiTable = await getKpashiTable(tableid);
  var game: KpashiGame = await getKpashiGame(table.currentGameId);
  var userinfo: any = await getUserInfo(userid);
  table.cancelCurrentGame(game, userid);
  await saveKpashiGame(game);
  await saveKpashiTable(table);
  const tableinfo = await getTableInfo(tableid);
  raiseCurrentGameCancelledEvent(tableinfo, userinfo, game.id);
}
