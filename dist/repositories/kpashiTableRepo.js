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
const kpashiTable_1 = require("../domain/kpashiTable");
const kpashiTableInfo_1 = require("../models/kpashiTableInfo");
const playerDetail_1 = require("../domain/playerDetail");
const KpashiTableInfo = mongoose.model("KpashiTableInfo", kpashiTableInfo_1.KpashiTableInfoSchema);
exports.getKpashiTable = (tableid) => __awaiter(this, void 0, void 0, function* () {
    var existingrec = yield KpashiTableInfo.findOne({ tableid: tableid });
    var returnobj = new kpashiTable_1.KpashiTable();
    returnobj.gameisOn = existingrec.gameon;
    returnobj.unitperround = existingrec.unitperround;
    returnobj.id = existingrec.tableid;
    var hostplayer = new playerDetail_1.PlayerDetail();
    hostplayer.playerid = existingrec.hostplayer.playerid;
    hostplayer.playername = existingrec.hostplayer.name;
    returnobj.hostplayer = hostplayer;
    returnobj.description = existingrec.description;
    returnobj.currentGameId = existingrec.currentGameId;
    returnobj.createdon = existingrec.createdon;
    if (existingrec.playerlist) {
        existingrec.playerlist.forEach(playerdetail => {
            var newplayerdetail = new playerDetail_1.PlayerDetail();
            newplayerdetail.creditbalance = playerdetail.creditbalance;
            newplayerdetail.playerid = playerdetail.playerid;
            newplayerdetail.playername = playerdetail.name;
            newplayerdetail.sittingposition = playerdetail.sittingposition;
            returnobj.playerlist.push(newplayerdetail);
        });
    }
    return returnobj;
});
exports.saveKpashiTable = (kpashitable) => __awaiter(this, void 0, void 0, function* () {
    var hostplayer = {};
    hostplayer.playerid = kpashitable.hostplayer.playerid;
    hostplayer.name = kpashitable.hostplayer.playername;
    var playerlist = [];
    if (kpashitable.playerlist) {
        kpashitable.playerlist.forEach(playerinfo => {
            var newrec = {};
            newrec.playerid = playerinfo.playerid;
            newrec.name = playerinfo.playername;
            newrec.sittingposition = playerinfo.sittingposition;
            newrec.creditbalance = playerinfo.creditbalance;
            playerlist.push(newrec);
        });
    }
    var newkpashitable = {};
    newkpashitable.tableid = kpashitable.id;
    newkpashitable.unitperround = kpashitable.unitperround;
    newkpashitable.gameison = kpashitable.gameisOn;
    newkpashitable.description = kpashitable.description;
    newkpashitable.currentGameId = kpashitable.currentGameId;
    newkpashitable.createdon = kpashitable.createdon;
    newkpashitable.hostplayer = hostplayer;
    newkpashitable.playerlist = playerlist;
    yield KpashiTableInfo.findOneAndUpdate({ tableid: kpashitable.id }, newkpashitable, { upsert: true });
});
//# sourceMappingURL=kpashiTableRepo.js.map