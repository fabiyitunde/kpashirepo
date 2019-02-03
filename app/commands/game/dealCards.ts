import {
  getKpashiGame,
  saveKpashiGame
} from "../../repositories/kpashiGameRepo";
import { KpashiGame } from "./../../domain/kpashiGame";
import { getUserInfo } from "../../queries/getUserInfo";
import { raiseDealingCardsCompleteEndedEvent } from "../../domainevents/gameEvents";
export async function dealCards(gameid: string, userid: string) {
  var game: KpashiGame = await getKpashiGame(gameid);
  var userinfo: any = await getUserInfo(userid);
  game.dealcards(userid);
  await saveKpashiGame(game);
  raiseDealingCardsCompleteEndedEvent(gameid, userinfo);
}
