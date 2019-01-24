"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const playerSchema = new mongoose.Schema({
    playerid: {
        type: String,
        required: "id is required"
    },
    name: {
        type: String,
        required: "name is required"
    },
    sittingposition: {
        type: Number
    },
    creditbalance: {
        type: Number
    }
});
exports.KpashiTableInfoSchema = new mongoose.Schema({
    tableid: {
        type: String,
        required: "Table Id is required"
    },
    unitperround: {
        type: Number
    },
    gameison: {
        type: Boolean
    },
    hostplayer: {
        type: playerSchema
    },
    playerlist: {
        type: [playerSchema]
    }
});
//# sourceMappingURL=kpashiTableInfo.js.map