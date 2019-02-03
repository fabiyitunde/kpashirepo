import {
  getKpashiGame,
  saveKpashiGame
} from "../../repositories/kpashiGameRepo";
import { KpashiGame } from "./../../domain/kpashiGame";
import { getUserInfo } from "../../queries/getUserInfo";
import { raiseShufflingEndedEvent } from "../../domainevents/gameEvents";
export async function shuffleCards(gameid: string, userid: string) {
  var game: KpashiGame = await getKpashiGame(gameid);
  var userinfo: any = await getUserInfo(userid);
  game.shufflecards(userid);
  await saveKpashiGame(game);
  raiseShufflingEndedEvent(gameid, userinfo);
}
