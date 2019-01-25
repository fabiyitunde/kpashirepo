import * as mongoose from "mongoose";
import { KpashiGameInfoSchema } from "../models/kpashiGameInfo";
import { KpashiGame } from "../domain/kpashiGame";
import { Card } from "../domain/card";
import { Player } from "../domain/player";
import * as linq from "linq";
import { GameResult } from "domain/gameResult";

const KpashiGameInfo = mongoose.model("KpashiGameInfo", KpashiGameInfoSchema);

export const getKpashiGame = async (gameid: string): Promise<KpashiGame> => {
  var existingrec: any = await KpashiGameInfo.findOne({ id: gameid });
  var databaseplayerlist: {
    playerid: string;
    playername: string;
    winposition: number;
    sittingposition: number;
    creditbalance: number;
    cards: [{ suittype: number; cardtype: number }];
    cardsaffectedbycallingcards: [{ suittype: number; cardtype: number }];
  }[] = existingrec.playerlist;
  var domainplayerlist: Player[] = [];
  databaseplayerlist.forEach(dbplayer => {
    var newrec: Player = new Player();
    newrec.creditbalance = dbplayer.creditbalance;
    newrec.playerid = dbplayer.playerid;
    newrec.playername = dbplayer.playername;
    newrec.sittingposition = dbplayer.sittingposition;
    newrec.winposition = dbplayer.winposition;
    newrec.cards = linq
      .from(dbplayer.cards)
      .select(card => new Card(card.suittype, card.cardtype))
      .toArray();
    newrec.cardsaffectedbycallingcards = linq
      .from(dbplayer.cardsaffectedbycallingcards)
      .select(card => new Card(card.suittype, card.cardtype))
      .toArray();
    domainplayerlist.push(newrec);
  });
  var returnobj = new KpashiGame();
  var callingcard: { suittype: number; cardtype: number } =
    existingrec.callingcard;
  returnobj.callingcard = new Card(callingcard.suittype, callingcard.cardtype);
  var deckofcards: { position: number; suittype: number; cardtype: number }[] =
    existingrec.deckofcards;
  deckofcards = linq
    .from(deckofcards)
    .orderBy(a => a.position)
    .toArray();
  deckofcards.forEach(card => {
    returnobj.deckofcards.enqueue(new Card(card.suittype, card.cardtype));
  });

  var droppedcards: { playerid: String; suittype: number; cardtype: number }[] =
    existingrec.droppedcards;
  droppedcards.forEach(droppedcard => {
    var player = domainplayerlist.find(a => a.playerid == droppedcard.playerid);
    var card = new Card(droppedcard.suittype, droppedcard.cardtype);
    returnobj.droppedcards.push([player, card]);
  });
  var firsttopick: [Player, Card] = [
    domainplayerlist.find(a => a.playerid == existingrec.firsttopick.playerid),
    new Card(existingrec.firsttopick.suittype, existingrec.firsttopick.cardtype)
  ];
  returnobj.firsttopick = firsttopick;
  var dbgameresults: { playerid: string; score: number; position: number }[] =
    existingrec.gameresults;
  dbgameresults.forEach(gameresult => {
    var gameresultplayer = domainplayerlist.find(
      a => a.playerid == gameresult.playerid
    );
    returnobj.gameresults.push(
      new GameResult(gameresultplayer, gameresult.score, gameresult.position)
    );
  });
  returnobj.gamestatus = existingrec.gamestatus;
  returnobj.id = existingrec.id;
  returnobj.kpashitableid = existingrec.kpashitableid;
  returnobj.lastplayerposition = existingrec.lastplayerposition;
  var openedcards: { position: number; suittype: number; cardtype: number }[] =
    existingrec.openedcards;
  openedcards = linq
    .from(openedcards)
    .orderBy(a => a.position)
    .toArray();
  openedcards.forEach(card => {
    returnobj.openedcards.enqueue(new Card(card.suittype, card.cardtype));
  });
  var pickupsequence: { position: number; playerid: string }[] =
    existingrec.pickupsequence;
  pickupsequence = linq
    .from(pickupsequence)
    .orderBy(a => a.position)
    .toArray();
  pickupsequence.forEach(pickupsequenceRec => {
    returnobj.pickupsequence.enqueue(
      domainplayerlist.find(a => a.playerid == pickupsequenceRec.playerid)
    );
  });
  returnobj.playerlist = domainplayerlist;
  var playingcards: { suittype: number; cardtype: number }[] =
    existingrec.playingcards;
  playingcards.forEach(card => {
    returnobj.playingcards.push(new Card(card.suittype, card.cardtype));
  });
  returnobj.startTime = existingrec.startTime;
  returnobj.startedAt = existingrec.startedAt;
  returnobj.unitsperhand = existingrec.unitsperhand;
  return returnobj;
};

export const saveKpashiGame = async (kpashigame: KpashiGame): Promise<any> => {
  var kpashigameinfo: {
    id: string;
    kpashitableid: string;
    playerlist: {
      playerid: string;
      playername: string;
      winposition: number;
      sittingposition: number;
      creditbalance: number;
      cards: { suittype: number; cardtype: number }[];
      cardsaffectedbycallingcards: { suittype: number; cardtype: number }[];
    }[];
    playingcards: { suittype: number; cardtype: number }[];
    deckofcards: { position: number; suittype: number; cardtype: number }[];
    unitsperhand: number;
    gamestatus: number;
    startedAt: Date;
    startTime: string;
    lastplayerposition: number;
    openedcards: { position: number; suittype: number; cardtype: number }[];
    callingcard: { suittype: number; cardtype: number };
    droppedcards: { playerid: string; suittype: number; cardtype: number }[];
    firsttopick: { playerid: string; suittype: number; cardtype: number };
    pickupsequence: { position: number; playerid: string }[];
    gameresults: { playerid: string; score: number; position: number }[];
  };
  kpashigameinfo.id = kpashigame.id;
  kpashigameinfo.kpashitableid = kpashigame.kpashitableid;
  kpashigame.playerlist.forEach(player => {
    var newplayer: {
      playerid: string;
      playername: string;
      winposition: number;
      sittingposition: number;
      creditbalance: number;
      cards: { suittype: number; cardtype: number }[];
      cardsaffectedbycallingcards: { suittype: number; cardtype: number }[];
    };
    newplayer.creditbalance = player.creditbalance;
    newplayer.playerid = player.playerid;
    newplayer.playername = player.playername;
    newplayer.sittingposition = player.sittingposition;
    newplayer.winposition = player.winposition;
    player.cards.forEach(card =>
      newplayer.cards.push({ suittype: card.suitType, cardtype: card.cardType })
    );
    player.cardsaffectedbycallingcards.forEach(card =>
      newplayer.cardsaffectedbycallingcards.push({
        suittype: card.suitType,
        cardtype: card.cardType
      })
    );
    kpashigameinfo.playerlist.push(newplayer);
  });
  kpashigame.playingcards.forEach(card =>
    kpashigameinfo.playingcards.push({
      suittype: card.suitType,
      cardtype: card.cardType
    })
  );
  var queuepositioncounter: number = 0;
  while (kpashigame.deckofcards.length > 0) {
    queuepositioncounter += 1;
    var selectedcard = kpashigame.deckofcards.dequeue();
    kpashigameinfo.deckofcards.push({
      position: queuepositioncounter,
      suittype: selectedcard.suitType,
      cardtype: selectedcard.cardType
    });
  }
  kpashigameinfo.unitsperhand = kpashigame.unitsperhand;
  kpashigameinfo.gamestatus = kpashigame.gamestatus;
  kpashigameinfo.startedAt = kpashigame.startedAt;
  kpashigameinfo.startTime = kpashigame.startTime;
  kpashigameinfo.lastplayerposition = kpashigame.lastplayerposition;
  queuepositioncounter = 0;
  while (kpashigame.openedcards.length > 0) {
    queuepositioncounter += 1;
    var selectedcard = kpashigame.openedcards.dequeue();
    kpashigameinfo.openedcards.push({
      position: queuepositioncounter,
      suittype: selectedcard.suitType,
      cardtype: selectedcard.cardType
    });
  }
  kpashigameinfo.callingcard = {
    suittype: kpashigame.callingcard.suitType,
    cardtype: kpashigame.callingcard.cardType
  };
  kpashigame.droppedcards.forEach(droppedcard => {
    kpashigameinfo.droppedcards.push({
      playerid: droppedcard[0].playerid,
      suittype: droppedcard[1].suitType,
      cardtype: droppedcard[1].cardType
    });
  });
  kpashigameinfo.firsttopick = {
    playerid: kpashigame.firsttopick[0].playerid,
    suittype: kpashigame.firsttopick[1].suitType,
    cardtype: kpashigame.firsttopick[1].cardType
  };
  queuepositioncounter = 0;
  while (kpashigame.pickupsequence.length > 0) {
    queuepositioncounter += 1;
    var selectedplayer = kpashigame.pickupsequence.dequeue();
    kpashigameinfo.pickupsequence.push({
      position: queuepositioncounter,
      playerid: selectedplayer.playerid
    });
  }
  kpashigame.gameresults.forEach(gameresult => {
    kpashigameinfo.gameresults.push({
      playerid: gameresult.player.playerid,
      score: gameresult.score,
      position: gameresult.position
    });
  });
  await KpashiGameInfo.findOneAndUpdate({ id: kpashigame.id }, kpashigameinfo, {
    upsert: true
  });
  return kpashigameinfo;
};
