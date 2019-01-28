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
const kpashiPlayer_1 = require("../../models/kpashiPlayer");
const tokenvalidatorprovider_1 = require("../../utilities/tokenvalidatorprovider");
const kpashiTable_1 = require("../../domain/kpashiTable");
const kpashiTableRepo_1 = require("../../repositories/kpashiTableRepo");
class createMyTable {
    constructor(userid, description, unitperhand, credittoken, tableid) {
        this.userid = userid;
        this.description = description;
        this.unitperhand = unitperhand;
        this.credittoken = credittoken;
        this.tableid = tableid;
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            var newtable = new kpashiTable_1.KpashiTable();
            var unitvalue = tokenvalidatorprovider_1.validateToken(this.credittoken);
            var playerdetail = yield kpashiPlayer_1.KpashiPlayer.findOne({ id: this.userid });
            newtable.create(this.tableid, this.userid, playerdetail.fullname, this.unitperhand, unitvalue, this.description);
            yield kpashiTableRepo_1.saveKpashiTable(newtable);
        });
    }
}
exports.createMyTable = createMyTable;
//# sourceMappingURL=createMyTable.js.map