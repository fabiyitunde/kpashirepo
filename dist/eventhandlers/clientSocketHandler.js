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
const postal = require("postal");
var datetime = require("node-datetime");
var uuid = require("uuid/v5");
var uniqid = require("uniqid");
const param_1 = require("../param");
const getGameInfo_1 = require("../queries/getGameInfo");
const getMyGameDetails_1 = require("../queries/getMyGameDetails");
class clientSocketHandler {
    constructor(io) {
        const channel = postal.channel(param_1.postalChannels.kpashiChannel);
        channel.subscribe(param_1.postalTopics.tableInvitation, eventobj => {
            this.sendTableInvite(eventobj, io);
        });
        channel.subscribe(param_1.postalTopics.tableInvitationAcceptance, eventobj => this.sendTableInvitationAcceptance(eventobj, io));
        channel.subscribe(param_1.postalTopics.playertoppedUpCredit, eventobj => this.onClientToppedUpCredit(eventobj, io));
        channel.subscribe(param_1.postalTopics.firstGameStarted, (eventobj) => __awaiter(this, void 0, void 0, function* () { return yield this.onFirstGameStarted(eventobj, io); }));
        channel.subscribe(param_1.postalTopics.shufflingEnded, (eventobj) => __awaiter(this, void 0, void 0, function* () { return yield this.onSuffleEnded(eventobj, io); }));
        channel.subscribe(param_1.postalTopics.dealingCardsComplete, (eventobj) => __awaiter(this, void 0, void 0, function* () { return yield this.onDealingCardsComplete(eventobj, io); }));
        channel.subscribe(param_1.postalTopics.cardDropped, (eventobj) => __awaiter(this, void 0, void 0, function* () { return yield this.onCardDropped(eventobj, io); }));
    }
    sendTableInvite(eventobj, io) {
        var { tableinfo, hostuserinfo, guestuserinfo } = eventobj;
        var returnobj = {};
        returnobj.payload = tableinfo;
        returnobj.address = param_1.clientSideHandlerAddresses.tableinvite;
        returnobj.source = hostuserinfo;
        returnobj.description = "Table Invitation Needs Your Attention";
        returnobj.time = new Date().toString();
        const uniqueid = uniqid();
        returnobj.id = uuid(uniqueid, uuid.DNS);
        var eventname = "userevent" + guestuserinfo.id;
        io.emit(eventname, returnobj);
    }
    sendTableInvitationAcceptance(eventobj, io) {
        var { tableinfo, userinfo } = eventobj;
        var members = tableinfo.members;
        members.forEach(player => {
            if (player.id != userinfo.id) {
                var returnobj = {};
                returnobj.payload = tableinfo;
                returnobj.address = param_1.clientSideHandlerAddresses.tableinviteResponse;
                returnobj.source = userinfo;
                returnobj.description = userinfo.fullname + " just joined the Table";
                returnobj.time = new Date().toString();
                returnobj.id = uuid(uniqid(), uuid.DNS);
                returnobj.reduceraction = param_1.clientSideReducerActions.playerjoinedtable;
                var eventname = "userevent" + player.id;
                io.emit(eventname, returnobj);
            }
        });
    }
    onClientToppedUpCredit(eventobj, io) {
        var { tableinfo, userinfo } = eventobj;
        var members = tableinfo.members;
        members.forEach(player => {
            if (player.id != userinfo.id) {
                var returnobj = {};
                returnobj.payload = tableinfo;
                returnobj.address = param_1.clientSideHandlerAddresses.tableinviteResponse;
                returnobj.source = userinfo;
                returnobj.description = userinfo.fullname + " just Topped Up Credit";
                returnobj.time = new Date().toString();
                returnobj.id = uuid(uniqid(), uuid.DNS);
                returnobj.reduceraction = param_1.clientSideReducerActions.playertoppedUpCredit;
                var eventname = "userevent" + player.id;
                io.emit(eventname, returnobj);
            }
        });
    }
    onFirstGameStarted(eventobj, io) {
        return __awaiter(this, void 0, void 0, function* () {
            var gameinfo = yield getGameInfo_1.getGameInfo(eventobj.gameid);
            var playerlist = gameinfo.playerlist;
            for (let index = 0; index < playerlist.length; index++) {
                const player = playerlist[index];
                if (player.playerid == eventobj.userinfo.id)
                    continue;
                var mygamedetails = yield getMyGameDetails_1.getMyGameDetails(player.playerid, eventobj.gameid);
                var returnobj = {};
                returnobj.payload = mygamedetails;
                returnobj.address = param_1.clientSideHandlerAddresses.gameViewOpened;
                returnobj.source = eventobj.userinfo;
                returnobj.description =
                    eventobj.userinfo.fullname +
                        " just Started a New Game with you included";
                returnobj.time = new Date().toString();
                returnobj.id = uuid(uniqid(), uuid.DNS);
                returnobj.reduceraction = param_1.clientSideReducerActions.firstGameStarted;
                var eventname = "userevent" + player.id;
                io.emit(eventname, returnobj);
            }
        });
    }
    onSuffleEnded(eventobj, io) {
        return __awaiter(this, void 0, void 0, function* () {
            var gameinfo = yield getGameInfo_1.getGameInfo(eventobj.gameid);
            var playerlist = gameinfo.playerlist;
            for (let index = 0; index < playerlist.length; index++) {
                const player = playerlist[index];
                if (player.playerid == eventobj.userinfo.id)
                    continue;
                var mygamedetails = yield getMyGameDetails_1.getMyGameDetails(player.playerid, eventobj.gameid);
                var returnobj = {};
                returnobj.payload = mygamedetails;
                returnobj.address = param_1.clientSideHandlerAddresses.gameViewOpened;
                returnobj.source = eventobj.userinfo;
                returnobj.description =
                    eventobj.userinfo.fullname + " just Finished Shuffling The Cards";
                returnobj.time = new Date().toString();
                returnobj.id = uuid(uniqid(), uuid.DNS);
                returnobj.reduceraction = param_1.clientSideReducerActions.shufflingEnded;
                var eventname = "userevent" + player.id;
                io.emit(eventname, returnobj);
            }
        });
    }
    onDealingCardsComplete(eventobj, io) {
        return __awaiter(this, void 0, void 0, function* () {
            var gameinfo = yield getGameInfo_1.getGameInfo(eventobj.gameid);
            var playerlist = gameinfo.playerlist;
            for (let index = 0; index < playerlist.length; index++) {
                const player = playerlist[index];
                if (player.playerid == eventobj.userinfo.id)
                    continue;
                var mygamedetails = yield getMyGameDetails_1.getMyGameDetails(player.playerid, eventobj.gameid);
                var returnobj = {};
                returnobj.payload = mygamedetails;
                returnobj.address = param_1.clientSideHandlerAddresses.gameViewOpened;
                returnobj.source = eventobj.userinfo;
                returnobj.description =
                    eventobj.userinfo.fullname + " just Finished Dealing The Cards";
                returnobj.time = new Date().toString();
                returnobj.id = uuid(uniqid(), uuid.DNS);
                returnobj.reduceraction = param_1.clientSideReducerActions.dealingCardsComplete;
                var eventname = "userevent" + player.id;
                io.emit(eventname, returnobj);
            }
        });
    }
    onCardDropped(eventobj, io) {
        return __awaiter(this, void 0, void 0, function* () {
            var gameinfo = yield getGameInfo_1.getGameInfo(eventobj.gameid);
            var playerlist = gameinfo.playerlist;
            for (let index = 0; index < playerlist.length; index++) {
                const player = playerlist[index];
                if (player.playerid == eventobj.userinfo.id)
                    continue;
                var mygamedetails = yield getMyGameDetails_1.getMyGameDetails(player.playerid, eventobj.gameid);
                var returnobj = {};
                returnobj.payload = mygamedetails;
                returnobj.address = param_1.clientSideHandlerAddresses.gameViewOpened;
                returnobj.source = eventobj.userinfo;
                returnobj.description =
                    eventobj.userinfo.fullname + " just Dropped a Card";
                returnobj.time = new Date().toString();
                returnobj.id = uuid(uniqid(), uuid.DNS);
                returnobj.reduceraction = param_1.clientSideReducerActions.cardDropped;
                var eventname = "userevent" + player.id;
                io.emit(eventname, returnobj);
            }
        });
    }
}
exports.clientSocketHandler = clientSocketHandler;
//# sourceMappingURL=clientSocketHandler.js.map