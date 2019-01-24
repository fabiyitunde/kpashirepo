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
const mongoose = require("mongoose");
const kpashiTable_1 = require("../domain/kpashiTable");
const kpashiTableInfo_1 = require("../models/kpashiTableInfo");
const KpashiTableInfo = mongoose.model("KpashiTableInfo", kpashiTableInfo_1.KpashiTableInfoSchema);
exports.getKpashiTable = (tableid) => __awaiter(this, void 0, void 0, function* () {
    var existingrec = yield KpashiTableInfo.findOne({ tableid: tableid });
    var returnobj = new kpashiTable_1.KpashiTable();
    returnobj.gameisOn = existingrec[""];
    return returnobj;
});
//# sourceMappingURL=kpashiTableRepo.js.map