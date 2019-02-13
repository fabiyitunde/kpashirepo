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
const linq = require("linq");
const kpashiGameInfo_1 = require("../models/kpashiGameInfo");
const getTableInfo_1 = require("./getTableInfo");
const gamestatus_1 = require("../domain/gamestatus");
const kpashiPlayer_1 = require("../models/kpashiPlayer");
const KpashiGameInfo = mongoose.model("KpashiGameInfo", kpashiGameInfo_1.KpashiGameInfoSchema);
exports.getMyGameDetails = (userid, gameid) => __awaiter(this, void 0, void 0, function* () {
    var gamedetails = {};
    var gameinfo = yield KpashiGameInfo.findOne({ id: gameid });
    var tableinfo = yield getTableInfo_1.getTableInfo(gameinfo.kpashitableid);
    var playerlist = gameinfo.playerlist;
    var currentplayer = playerlist.find(a => a.playerid == userid);
    var myinfo = yield kpashiPlayer_1.KpashiPlayer.findOne({ id: userid });
    var currentplayercards = currentplayer.cards;
    var openedcards = gameinfo.openedcards;
    var droppedcards = gameinfo.droppedcards;
    var filterlist = linq
        .from(playerlist)
        .select(player => {
        var ret = { id: player.playerid };
        return ret;
    })
        .toArray();
    var playerinfolist = yield kpashiPlayer_1.KpashiPlayer.find({
        $or: [...filterlist]
    });
    gamedetails.id = gameid;
    gamedetails.tableid = gameinfo.kpashitableid;
    gamedetails.tabledescription = tableinfo.description;
    gamedetails.hostname = tableinfo.hostname;
    gamedetails.unitsperhand = gameinfo.unitsperhand;
    gamedetails.startedat = gameinfo.startedAt;
    gamedetails.myname = myinfo.fullname;
    gamedetails.myphotourl = myinfo.photourl;
    gamedetails.nextplayerdetail = {
        playerid: gameinfo.nextplayerdetail.playerid,
        playername: gameinfo.nextplayerdetail.playername
    };
    gamedetails.gamestatusdetail = {
        status: gameinfo.gamestatus,
        description: gamestatus_1.GameStatus[gameinfo.gamestatus]
    };
    var playerDetails = [];
    var gameresults = gameinfo.gameresults;
    for (let index = 0; index < playerlist.length; index++) {
        const player = playerlist[index];
        const gameresult = gameresults.find(a => a.playerid == player.playerid);
        var playerinfo = playerinfolist.find(a => a.id == player.playerid);
        var gamestatus = "";
        if (gameresult)
            gamestatus = gameresult.position == 1 ? "Winner" : "Loser";
        var playerdetail = {};
        var dropedcard = droppedcards.find(a => a.playerid == player.playerid);
        playerdetail.id = playerinfo.id;
        playerdetail.fullname = playerinfo.fullname;
        playerdetail.photourl = playerinfo.photourl;
        playerdetail.sittingposition = player.sittingposition;
        playerdetail.gameStatus =
            gameinfo.gamestatus == gamestatus_1.GameStatus.Finished ? gamestatus : "Indeterminate";
        playerdetail.dropedcard =
            dropedcard == null
                ? null
                : { suittype: dropedcard.suittype, cardtype: dropedcard.cardtype };
        if (gameinfo.gamestatus == gamestatus_1.GameStatus.Finished) {
            playerdetail.cards = player.cards;
            playerdetail.score = gameresult.score;
        }
        else {
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
    var tableinfoplayerlist = tableinfo.playerlist;
    var readytoplayPlayerRec = tableinfoplayerlist.find(a => a.playerid == userid);
    if (readytoplayPlayerRec)
        gamedetails.readytoplay = readytoplayPlayerRec.readytoplay;
    return gamedetails;
});
//# sourceMappingURL=getMyGameDetails.js.map