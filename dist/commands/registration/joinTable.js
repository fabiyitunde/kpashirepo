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
const tokenvalidatorprovider_1 = require("../../utilities/tokenvalidatorprovider");
const getUserInfo_1 = require("../../queries/getUserInfo");
const getTableInfo_1 = require("../../queries/getTableInfo");
const param_1 = require("../../param");
const postal = require("postal");
class joinTable {
    constructor(userid, tableid, credittoken) {
        this.userid = userid;
        this.tableid = tableid;
        this.credittoken = credittoken;
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            var kpashitable = yield kpashiTableRepo_1.getKpashiTable(this.tableid);
            var unitvalue = tokenvalidatorprovider_1.validateToken(this.credittoken);
            var userinfo = yield getUserInfo_1.getUserInfo(this.userid);
            kpashitable.addplayer(this.userid, userinfo.fullname, unitvalue);
            yield kpashiTableRepo_1.saveKpashiTable(kpashitable);
            var eventobj = {};
            eventobj.tableinfo = yield getTableInfo_1.getTableInfo(this.tableid);
            eventobj.userinfo = userinfo;
            const channel = postal.channel(param_1.postalChannels.kpashiChannel);
            channel.publish(param_1.postalTopics.tableInvitationAcceptance, eventobj);
        });
    }
}
exports.joinTable = joinTable;
//# sourceMappingURL=joinTable.js.map