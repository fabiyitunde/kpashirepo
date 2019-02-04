import {
  getKpashiTable,
  saveKpashiTable
} from "../../repositories/kpashiTableRepo";
import { getUserInfo } from "../../queries/getUserInfo";
import { saveKpashiGame } from "../../repositories/kpashiGameRepo";
import { raiseNewGameStartedEvent } from "../../domainevents/gameEvents";
export async function startNewGame(
  userid: string,
  tableid: string,
  gameid: string
) {
  var kpashitable = await getKpashiTable(tableid);
  var userinfo: any = await getUserInfo(userid);

  var newgame = kpashitable.createKpashiGameWithPlayerIdOfFirstPlayer(
    gameid,
    userid
  );
  await saveKpashiTable(kpashitable);
  await saveKpashiGame(newgame);
  raiseNewGameStartedEvent(gameid, userinfo);
}
