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
const kpashiTableRepo_1 = require("../../repositories/kpashiTableRepo");
const getUserInfo_1 = require("../../queries/getUserInfo");
const kpashiGameRepo_1 = require("../../repositories/kpashiGameRepo");
const gameEvents_1 = require("../../domainevents/gameEvents");
function startFirstGame(userid, tableid, gameid) {
    return __awaiter(this, void 0, void 0, function* () {
        var kpashitable = yield kpashiTableRepo_1.getKpashiTable(tableid);
        var userinfo = yield getUserInfo_1.getUserInfo(userid);
        if (kpashitable.hostplayer.playerid != userid) {
            throw "Only Host Can Start A New Round";
        }
        var newgame = kpashitable.createKpashiGame(gameid);
        yield kpashiTableRepo_1.saveKpashiTable(kpashitable);
        yield kpashiGameRepo_1.saveKpashiGame(newgame);
        gameEvents_1.raiseFirstGameStartedEvent(gameid, userinfo);
    });
}
exports.startFirstGame = startFirstGame;
//# sourceMappingURL=startFirstGame.js.map