"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const kpashiGameInfo_1 = require("../models/kpashiGameInfo");
const kpashiGame_1 = require("../domain/kpashiGame");
const card_1 = require("../domain/card");
const player_1 = require("../domain/player");
const linq = require("linq");
const gameResult_1 = require("../domain/gameResult");
const KpashiGameInfo = mongoose.model("KpashiGameInfo", kpashiGameInfo_1.KpashiGameInfoSchema);
exports.getKpashiGame = (gameid) => __awaiter(this, void 0, void 0, function* () {
    var existingrec = yield KpashiGameInfo.findOne({ id: gameid });
    var databaseplayerlist = existingrec.playerlist;
    var domainplayerlist = [];
    databaseplayerlist.forEach(dbplayer => {
        var newrec = new player_1.Player();
        newrec.creditbalance = dbplayer.creditbalance;
        newrec.playerid = dbplayer.playerid;
        newrec.playername = dbplayer.playername;
        newrec.sittingposition = dbplayer.sittingposition;
        newrec.winposition = dbplayer.winposition;
        newrec.cards = linq
            .from(dbplayer.cards)
            .select(card => new card_1.Card(card.suittype, card.cardtype))
            .toArray();
        newrec.cardsaffectedbycallingcards = linq
            .from(dbplayer.cardsaffectedbycallingcards)
            .select(card => new card_1.Card(card.suittype, card.cardtype))
            .toArray();
        domainplayerlist.push(newrec);
    });
    var returnobj = new kpashiGame_1.KpashiGame();
    if (existingrec.callingcard) {
        var callingcard = existingrec.callingcard;
        returnobj.callingcard = new card_1.Card(callingcard.suittype, callingcard.cardtype);
    }
    var deckofcards = existingrec.deckofcards;
    deckofcards = linq
        .from(deckofcards)
        .orderBy(a => a.position)
        .toArray();
    deckofcards.forEach(card => {
        returnobj.deckofcards.enqueue(new card_1.Card(card.suittype, card.cardtype));
    });
    var droppedcards = existingrec.droppedcards;
    droppedcards.forEach(droppedcard => {
        var player = domainplayerlist.find(a => a.playerid == droppedcard.playerid);
        var card = new card_1.Card(droppedcard.suittype, droppedcard.cardtype);
        returnobj.droppedcards.push([player, card]);
    });
    if (existingrec.firsttopick.playerid) {
        var firsttopick = [
            domainplayerlist.find(a => a.playerid == existingrec.firsttopick.playerid),
            new card_1.Card(existingrec.firsttopick.suittype, existingrec.firsttopick.cardtype)
        ];
        returnobj.firsttopick = firsttopick;
    }
    else {
        returnobj.firsttopick = null;
    }
    var dbgameresults = existingrec.gameresults;
    dbgameresults.forEach(gameresult => {
        var gameresultplayer = domainplayerlist.find(a => a.playerid == gameresult.playerid);
        returnobj.gameresults.push(new gameResult_1.GameResult(gameresultplayer, gameresult.score, gameresult.position));
    });
    returnobj.gamestatus = existingrec.gamestatus;
    returnobj.id = existingrec.id;
    returnobj.kpashitableid = existingrec.kpashitableid;
    returnobj.lastplayerposition = existingrec.lastplayerposition;
    var openedcards = existingrec.openedcards;
    openedcards = linq
        .from(openedcards)
        .orderBy(a => a.position)
        .toArray();
    openedcards.forEach(card => {
        returnobj.openedcards.enqueue(new card_1.Card(card.suittype, card.cardtype));
    });
    var pickupsequence = existingrec.pickupsequence;
    pickupsequence = linq
        .from(pickupsequence)
        .orderBy(a => a.position)
        .toArray();
    pickupsequence.forEach(pickupsequenceRec => {
        returnobj.pickupsequence.enqueue(domainplayerlist.find(a => a.playerid == pickupsequenceRec.playerid));
    });
    returnobj.playerlist = domainplayerlist;
    var playingcards = existingrec.playingcards;
    playingcards.forEach(card => {
        returnobj.playingcards.push(new card_1.Card(card.suittype, card.cardtype));
    });
    returnobj.startTime = existingrec.startTime;
    returnobj.startedAt = existingrec.startedAt;
    returnobj.unitsperhand = existingrec.unitsperhand;
    return returnobj;
});
exports.saveKpashiGame = (kpashigame) => __awaiter(this, void 0, void 0, function* () {
    var kpashigameinfo = {};
    kpashigameinfo.id = kpashigame.id;
    kpashigameinfo.kpashitableid = kpashigame.kpashitableid;
    var playerlist = kpashigame.playerlist;
    var kpashigameinfoplayerlist = [];
    playerlist.forEach(player => {
        var newplayer = {};
        newplayer.creditbalance = player.creditbalance;
        newplayer.playerid = player.playerid;
        newplayer.playername = player.playername;
        newplayer.sittingposition = player.sittingposition;
        newplayer.winposition = player.winposition;
        var cards = player.cards;
        var newplayercards = [];
        cards.forEach(card => newplayercards.push({ suittype: card.suitType, cardtype: card.cardType }));
        newplayer.cards = newplayercards;
        var cardsaffectedbycallingcards = player.cardsaffectedbycallingcards;
        var newplayercardsaffectedbycallingcards = [];
        cardsaffectedbycallingcards.forEach(card => newplayercardsaffectedbycallingcards.push({
            suittype: card.suitType,
            cardtype: card.cardType
        }));
        newplayer.cardsaffectedbycallingcards = newplayercardsaffectedbycallingcards;
        kpashigameinfoplayerlist.push(newplayer);
    });
    kpashigameinfo.playerlist = kpashigameinfoplayerlist;
    var playingcards = kpashigame.playingcards;
    var kpashigameinfoplayingcards = [];
    playingcards.forEach(card => kpashigameinfoplayingcards.push({
        suittype: card.suitType,
        cardtype: card.cardType
    }));
    kpashigameinfo.playingcards = kpashigameinfoplayingcards;
    var queuepositioncounter = 0;
    var kpashigameinfodeckofcards = [];
    while (kpashigame.deckofcards.length > 0) {
        queuepositioncounter += 1;
        var selectedcard = kpashigame.deckofcards.dequeue();
        kpashigameinfodeckofcards.push({
            position: queuepositioncounter,
            suittype: selectedcard.suitType,
            cardtype: selectedcard.cardType
        });
    }
    kpashigameinfo.deckofcards = kpashigameinfodeckofcards;
    kpashigameinfo.unitsperhand = kpashigame.unitsperhand;
    kpashigameinfo.gamestatus = kpashigame.gamestatus;
    kpashigameinfo.startedAt = kpashigame.startedAt;
    kpashigameinfo.startTime = kpashigame.startTime;
    kpashigameinfo.lastplayerposition = kpashigame.lastplayerposition;
    queuepositioncounter = 0;
    var kpashigameinfoopenedcards = [];
    while (kpashigame.openedcards.length > 0) {
        queuepositioncounter += 1;
        var selectedcard = kpashigame.openedcards.dequeue();
        kpashigameinfoopenedcards.push({
            position: queuepositioncounter,
            suittype: selectedcard.suitType,
            cardtype: selectedcard.cardType
        });
    }
    kpashigameinfo.openedcards = kpashigameinfoopenedcards;
    if (kpashigame.callingcard)
        kpashigameinfo.callingcard = {
            suittype: kpashigame.callingcard.suitType,
            cardtype: kpashigame.callingcard.cardType
        };
    var nextplayer = kpashigame.nextplayer();
    if (nextplayer)
        kpashigameinfo.nextplayerdetail = {
            playerid: nextplayer.playerid,
            playername: nextplayer.playername
        };
    var kpashigameinfodroppedcards = [];
    var droppedcards = kpashigame.droppedcards;
    if (droppedcards.length > 0) {
        droppedcards.forEach(droppedcard => {
            kpashigameinfodroppedcards.push({
                playerid: droppedcard[0].playerid,
                suittype: droppedcard[1].suitType,
                cardtype: droppedcard[1].cardType
            });
        });
    }
    kpashigameinfo.droppedcards = kpashigameinfodroppedcards;
    if (kpashigame.firsttopick && kpashigame.firsttopick[0])
        kpashigameinfo.firsttopick = {
            playerid: kpashigame.firsttopick[0].playerid,
            suittype: kpashigame.firsttopick[1].suitType,
            cardtype: kpashigame.firsttopick[1].cardType
        };
    queuepositioncounter = 0;
    var kpashigameinfopickupsequence = [];
    while (kpashigame.pickupsequence.length > 0) {
        queuepositioncounter += 1;
        var selectedplayer = kpashigame.pickupsequence.dequeue();
        kpashigameinfopickupsequence.push({
            position: queuepositioncounter,
            playerid: selectedplayer.playerid
        });
    }
    kpashigameinfo.pickupsequence = kpashigameinfopickupsequence;
    var kpashigameinfogameresults = [];
    var gameresults = kpashigame.gameresults;
    gameresults.forEach(gameresult => {
        kpashigameinfogameresults.push({
            playerid: gameresult.player.playerid,
            score: gameresult.score,
            position: gameresult.position
        });
    });
    kpashigameinfo.gameresults = kpashigameinfogameresults;
    yield KpashiGameInfo.findOneAndUpdate({ id: kpashigame.id }, kpashigameinfo, {
        upsert: true
    });
    return kpashigameinfo;
});
//# sourceMappingURL=kpashiGameRepo.js.map