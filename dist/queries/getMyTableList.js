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
const kpashiTableInfo_1 = require("../models/kpashiTableInfo");
const kpashiPlayer_1 = require("../models/kpashiPlayer");
const linq = require("linq");
const KpashiTableInfo = mongoose.model("KpashiTableInfo", kpashiTableInfo_1.KpashiTableInfoSchema);
exports.getMyTableList = (userid) => __awaiter(this, void 0, void 0, function* () {
    var resultlist = [];
    var tablelist = yield KpashiTableInfo.find({
        $or: [{ "hostplayer.playerid": userid }, { "playerlist.playerid": userid }]
    });
    if (tablelist == null || tablelist.length == 0)
        return resultlist;
    tablelist.forEach((tableinfo) => __awaiter(this, void 0, void 0, function* () {
        var newtableinfo = {};
        newtableinfo.id = tableinfo.tableid;
        newtableinfo.description = tableinfo.description;
        newtableinfo.hostname = tableinfo.hostplayer.name;
        newtableinfo.hostplayerid = tableinfo.hostplayer.playerid;
        newtableinfo.oneroundunit = tableinfo.unitperround;
        newtableinfo.currentGameId = tableinfo.currentGameId;
        newtableinfo.isOn = tableinfo.gameison;
        newtableinfo.createOn = tableinfo.createdon;
        var playerlist = tableinfo.playerlist;
        newtableinfo.membercount = playerlist.length;
        var memberlist = [];
        playerlist.forEach(player => {
            kpashiPlayer_1.KpashiPlayer.findOne({ id: player.playerid }).exec((err, doc) => {
                console.log("doc " + new Date().getTime().toLocaleString(), doc, tableinfo.description);
                var playerinfo = doc;
                var newplayer = {};
                newplayer.id = player.playerid;
                newplayer.fullname = playerinfo.fullname;
                newplayer.position = player.sittingposition;
                newplayer.unitbalance = player.creditbalance;
                newplayer.photourl = playerinfo.photourl;
                newplayer.lastactivitytime = playerinfo.lastactivitytime;
                memberlist.push(newplayer);
            });
        });
        newtableinfo.members = [...memberlist];
        resultlist.push(newtableinfo);
    }));
    return resultlist;
});
exports.getMyTableList2 = (userid) => __awaiter(this, void 0, void 0, function* () {
    var resultlist = [];
    var tablelist = yield KpashiTableInfo.find({
        $or: [{ "hostplayer.playerid": userid }, { "playerlist.playerid": userid }]
    });
    if (tablelist == null || tablelist.length == 0)
        return resultlist;
    tablelist.forEach((tableinfo) => __awaiter(this, void 0, void 0, function* () {
        var newtableinfo = {};
        newtableinfo.id = tableinfo.tableid;
        newtableinfo.description = tableinfo.description;
        newtableinfo.hostname = tableinfo.hostplayer.name;
        newtableinfo.hostplayerid = tableinfo.hostplayer.playerid;
        newtableinfo.oneroundunit = tableinfo.unitperround;
        newtableinfo.currentGameId = tableinfo.currentGameId;
        newtableinfo.isOn = tableinfo.gameison;
        newtableinfo.createOn = tableinfo.createdon;
        var playerlist = tableinfo.playerlist;
        var filterlist = linq.from(playerlist).select(player => {
            id: player.playerid;
        });
        var playerinfolist = yield kpashiPlayer_1.KpashiPlayer.find({ $or: filterlist });
        console.log("Database ", playerinfolist);
        newtableinfo.membercount = playerlist.length;
        var memberlist = [];
        playerlist.forEach(player => {
            var playerinfo = playerinfolist.find(a => a.id == player.playerid);
            var newplayer = {};
            newplayer.id = player.playerid;
            newplayer.fullname = playerinfo.fullname;
            newplayer.position = player.sittingposition;
            newplayer.unitbalance = player.creditbalance;
            newplayer.photourl = playerinfo.photourl;
            newplayer.lastactivitytime = playerinfo.lastactivitytime;
            memberlist.push(newplayer);
        });
        newtableinfo.members = [...memberlist];
        resultlist.push(newtableinfo);
        console.log(newtableinfo);
    }));
    return resultlist;
});
//# sourceMappingURL=getMyTableList.js.map