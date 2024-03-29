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
const kpashiTable_1 = require("../../domain/kpashiTable");
const kpashiTableRepo_1 = require("../../repositories/kpashiTableRepo");
const newGuid_1 = require("../../utilities/newGuid");
class createUser {
    constructor() {
        this.payload = {};
        this.isOk = false;
        this.errormsg = "";
    }
    createUser(userid, email, address, fullname, phone, photourl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var existingrec = yield kpashiPlayer_1.KpashiPlayer.findOne({ email: email });
                if (existingrec == undefined || existingrec == null) {
                    var newPlayer = new kpashiPlayer_1.KpashiPlayer({
                        id: userid,
                        fullname: fullname,
                        email: email,
                        address: address,
                        phone: phone,
                        photourl: photourl
                    });
                    this.payload = yield newPlayer.save();
                    var newtable = new kpashiTable_1.KpashiTable();
                    var tableid = newGuid_1.getNewGUID();
                    var tablename = fullname + " kpashi Table";
                    newtable.create(tableid, userid, fullname, 2, 10, tablename);
                    yield kpashiTableRepo_1.saveKpashiTable(newtable);
                }
                else {
                    this.payload = yield kpashiPlayer_1.KpashiPlayer.findOneAndUpdate({ id: userid }, {
                        fullname: fullname,
                        email: email,
                        address: address,
                        phone: phone,
                        photourl: photourl
                    });
                }
                this.isOk = true;
            }
            catch (error) {
                this.isOk = false;
                this.errormsg = error;
            }
        });
    }
}
exports.createUser = createUser;
//# sourceMappingURL=createUser.js.map