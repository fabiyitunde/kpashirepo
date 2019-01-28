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
const kpashiPlayer_1 = require("../models/kpashiPlayer");
exports.getAllUsersList = () => __awaiter(this, void 0, void 0, function* () {
    var userlist = yield kpashiPlayer_1.KpashiPlayer.find({});
    var returnlist = [];
    userlist.forEach(user => {
        var player = {};
        player.id = user.id;
        player.address = user.address;
        player.email = user.email;
        player.fullname = user.fullname;
        player.phone = user.phone;
        player.photourl = user.photourl;
        player.registrationDate = user.registrationDate;
        returnlist.push(player);
    });
    return returnlist;
});
//# sourceMappingURL=getAllUsersList.js.map