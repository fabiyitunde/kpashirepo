import {
  getKpashiGame,
  saveKpashiGame
} from "../../repositories/kpashiGameRepo";
import { KpashiGame } from "./../../domain/kpashiGame";
import { KpashiTable } from "../../domain/kpashiTable";
import { getUserInfo } from "../../queries/getUserInfo";
import { getTableInfo } from "../../queries/getTableInfo";
import {
  getKpashiTable,
  saveKpashiTable
} from "../../repositories/kpashiTableRepo";
import { raiseCardDroppedEvent } from "../../domainevents/gameEvents";
export async function dropCard(
  gameid: string,
  userid: string,
  suittype: number,
  cardtype: number
) {
  var game: KpashiGame = await getKpashiGame(gameid);
  var table: KpashiTable = await getKpashiTable(game.kpashitableid);
  var userinfo: any = await getUserInfo(userid);
  game.dropcard(userid, suittype, cardtype, gamehasended => {
    table.registerActivity(userid);
    if (gamehasended) table.gameEnded(game);
  });
  var tableinfo = await getTableInfo(game.kpashitableid);
  await saveKpashiTable(table);
  await saveKpashiGame(game);
  raiseCardDroppedEvent(gameid, userinfo, tableinfo);
}
