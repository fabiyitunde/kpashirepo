import {
  getKpashiTable,
  saveKpashiTable
} from "../../repositories/kpashiTableRepo";
import { getUserInfo } from "../../queries/getUserInfo";
import { saveKpashiGame } from "../../repositories/kpashiGameRepo";
import { raiseFirstGameStartedEvent } from "../../domainevents/gameEvents";
export async function startFirstGame(
  userid: string,
  tableid: string,
  gameid: string
) {
  var kpashitable = await getKpashiTable(tableid);
  var userinfo: any = await getUserInfo(userid);
  if (kpashitable.hostplayer.playerid != userid) {
    throw "Only Host Can Start A New Round";
  }
  var newgame = kpashitable.createKpashiGame(gameid);
  await saveKpashiTable(kpashitable);
  await saveKpashiGame(newgame);
  raiseFirstGameStartedEvent(gameid, userinfo);
}
