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
const param_1 = require("../param");
exports.raiseFirstGameStartedEvent = (gameid, userinfo) => __awaiter(this, void 0, void 0, function* () {
    var eventobj = {};
    eventobj.gameid = gameid;
    eventobj.userinfo = userinfo;
    const channel = postal.channel(param_1.postalChannels.kpashiChannel);
    channel.publish(param_1.postalTopics.firstGameStarted, eventobj);
});
exports.raiseShufflingEndedEvent = (gameid, userinfo) => {
    var eventobj = {};
    eventobj.gameid = gameid;
    eventobj.userinfo = userinfo;
    const channel = postal.channel(param_1.postalChannels.kpashiChannel);
    channel.publish(param_1.postalTopics.shufflingEnded, eventobj);
};
exports.raiseDealingCardsCompleteEndedEvent = (gameid, userinfo) => {
    var eventobj = {};
    eventobj.gameid = gameid;
    eventobj.userinfo = userinfo;
    const channel = postal.channel(param_1.postalChannels.kpashiChannel);
    channel.publish(param_1.postalTopics.dealingCardsComplete, eventobj);
};
exports.raiseCardDroppedEvent = (gameid, userinfo) => {
    var eventobj = {};
    eventobj.gameid = gameid;
    eventobj.userinfo = userinfo;
    const channel = postal.channel(param_1.postalChannels.kpashiChannel);
    channel.publish(param_1.postalTopics.cardDropped, eventobj);
};
//# sourceMappingURL=gameEvents.js.map