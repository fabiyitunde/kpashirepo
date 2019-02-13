import * as mongoose from "mongoose";
import * as linq from "linq";
import { KpashiGameInfoSchema } from "../models/kpashiGameInfo";
import { getTableInfo } from "./getTableInfo";
import { GameStatus } from "../domain/gamestatus";
import { KpashiPlayer } from "../models/kpashiPlayer";

const KpashiGameInfo = mongoose.model("KpashiGameInfo", KpashiGameInfoSchema);
export const getMyGameDetails = async (userid: string, gameid: string) => {
  var gamedetails: any = {};
  var gameinfo: any = await KpashiGameInfo.findOne({ id: gameid });
  var tableinfo: any = await getTableInfo(gameinfo.kpashitableid);
  var playerlist: any[] = gameinfo.playerlist;
  var currentplayer: any = playerlist.find(a => a.playerid == userid);
  var currentplayercards: any[] = currentplayer.cards;
  var openedcards: any[] = gameinfo.openedcards;

  var droppedcards: any[] = gameinfo.droppedcards;
  var filterlist = linq
    .from(playerlist)
    .select(player => {
      var ret: any = { id: player.playerid };
      return ret;
    })
    .toArray();
  var playerinfolist: any[] = await KpashiPlayer.find({
    $or: [...filterlist]
  });

  gamedetails.id = gameid;
  gamedetails.tableid = gameinfo.kpashitableid;
  gamedetails.tabledescription = tableinfo.description;
  gamedetails.hostname = tableinfo.hostname;
  gamedetails.unitsperhand = gameinfo.unitsperhand;
  gamedetails.startedat = gameinfo.startedAt;
  gamedetails.nextplayerdetail = {
    playerid: gameinfo.nextplayerdetail.playerid,
    playername: gameinfo.nextplayerdetail.playername
  };
  gamedetails.gamestatusdetail = {
    status: gameinfo.gamestatus,
    description: GameStatus[gameinfo.gamestatus]
  };
  var playerDetails: any[] = [];
  var gameresults: any[] = gameinfo.gameresults;
  for (let index = 0; index < playerlist.length; index++) {
    const player = playerlist[index];
    const gameresult = gameresults.find(a => a.playerid == player.playerid);
    var playerinfo: any = playerinfolist.find(a => a.id == player.playerid);
    var gamestatus: string = "";
    if (gameresult) gamestatus = gameresult.position == 1 ? "Winner" : "Loser";
    var playerdetail: any = {};
    var dropedcard = droppedcards.find(a => a.playerid == player.playerid);
    playerdetail.id = playerinfo.id;
    playerdetail.fullname = playerinfo.fullname;
    playerdetail.photourl = playerinfo.photourl;
    playerdetail.sittingposition = player.sittingposition;
    playerdetail.gameStatus =
      gameinfo.gamestatus == GameStatus.Finished ? gamestatus : "Indeterminate";
    playerdetail.dropedcard =
      dropedcard == null
        ? null
        : { suittype: dropedcard.suittype, cardtype: dropedcard.cardtype };
    if (gameinfo.gamestatus == GameStatus.Finished) {
      playerdetail.cards = player.cards;
      playerdetail.score = gameresult.score;
    } else {
      playerdetail.cards = null;
    }
    playerDetails.push(playerdetail);
  }
  gamedetails.playerDetails = playerDetails;
  gamedetails.playercount = playerDetails.length;
  gamedetails.openedcards =
    openedcards == null || openedcards.length == 0
      ? []
      : linq
          .from(openedcards)
          .orderBy(a => a.position)
          .toArray();
  gamedetails.mycards =
    currentplayercards == null || currentplayercards.length == 0
      ? []
      : currentplayercards;

  gamedetails.readytoplay = true;
  var tableinfoplayerlist: any[] = tableinfo.playerlist;
  var readytoplayPlayerRec = tableinfoplayerlist.find(
    a => a.playerid == userid
  );
  if (readytoplayPlayerRec)
    gamedetails.readytoplay = readytoplayPlayerRec.readytoplay;

  return gamedetails;
};
