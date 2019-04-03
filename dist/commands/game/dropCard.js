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
const kpashiGameRepo_1 = require("../../repositories/kpashiGameRepo");
const getUserInfo_1 = require("../../queries/getUserInfo");
const getTableInfo_1 = require("../../queries/getTableInfo");
const kpashiTableRepo_1 = require("../../repositories/kpashiTableRepo");
const gameEvents_1 = require("../../domainevents/gameEvents");
function dropCard(gameid, userid, suittype, cardtype) {
    return __awaiter(this, void 0, void 0, function* () {
        var game = yield kpashiGameRepo_1.getKpashiGame(gameid);
        var table = yield kpashiTableRepo_1.getKpashiTable(game.kpashitableid);
        var userinfo = yield getUserInfo_1.getUserInfo(userid);
        game.dropcard(userid, suittype, cardtype, gamehasended => {
            table.registerActivity(userid);
            if (gamehasended)
                table.gameEnded(game);
        });
        yield kpashiTableRepo_1.saveKpashiTable(table);
        yield kpashiGameRepo_1.saveKpashiGame(game);
        var tableinfo = yield getTableInfo_1.getTableInfo(game.kpashitableid);
        gameEvents_1.raiseCardDroppedEvent(gameid, userinfo, tableinfo);
    });
}
exports.dropCard = dropCard;
//# sourceMappingURL=dropCard.js.map