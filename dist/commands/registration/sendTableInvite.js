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
const getTableInfo_1 = require("../../queries/getTableInfo");
const getUserInfo_1 = require("../../queries/getUserInfo");
const postal = require("postal");
const param_1 = require("../../param");
class sendTableInvite {
    constructor(hostuserid, guestuserid, tableid) {
        this.guestuserid = guestuserid;
        this.hostuserid = hostuserid;
        this.tableid = tableid;
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            var kpashitable = yield kpashiTableRepo_1.getKpashiTable(this.tableid);
            if (kpashitable.gameisOn)
                throw "Player Addition Not Allowed In The Middle Of A Game";
            if (kpashitable.playerAlreadyExist(this.guestuserid))
                throw "Player Already In Group";
            var eventobj = {};
            eventobj.tableinfo = yield getTableInfo_1.getTableInfo(this.tableid);
            eventobj.hostuserinfo = yield getUserInfo_1.getUserInfo(this.hostuserid);
            eventobj.guestuserinfo = yield getUserInfo_1.getUserInfo(this.guestuserid);
            const channel = postal.channel(param_1.postalChannels.kpashiChannel);
            channel.publish(param_1.postalTopics.tableInvitation, eventobj);
        });
    }
}
exports.sendTableInvite = sendTableInvite;
//# sourceMappingURL=sendTableInvite.js.map