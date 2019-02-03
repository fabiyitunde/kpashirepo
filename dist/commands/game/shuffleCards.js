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
const gameEvents_1 = require("../../domainevents/gameEvents");
function shuffleCards(gameid, userid) {
    return __awaiter(this, void 0, void 0, function* () {
        var game = yield kpashiGameRepo_1.getKpashiGame(gameid);
        var userinfo = yield getUserInfo_1.getUserInfo(userid);
        game.shufflecards(userid);
        yield kpashiGameRepo_1.saveKpashiGame(game);
        gameEvents_1.raiseShufflingEndedEvent(gameid, userinfo);
    });
}
exports.shuffleCards = shuffleCards;
//# sourceMappingURL=shuffleCards.js.map