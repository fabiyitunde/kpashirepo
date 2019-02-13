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
    },
    readytoplay: {
        type: Boolean
    },
    lastactivity: {
        type: Date
    }
});
exports.KpashiTableInfoSchema = new mongoose.Schema({
    tableid: {
        type: String,
        required: "Table Id is required"
    },
    description: { type: String },
    unitperround: {
        type: Number
    },
    currentGameId: {
        type: String
    },
    gameison: {
        type: Boolean
    },
    hostplayer: {
        type: playerSchema
    },
    createdon: { type: Date },
    playerlist: {
        type: [playerSchema]
    },
    playingqueue: {
        type: [{ position: Number, playerid: String }]
    }
});
//# sourceMappingURL=kpashiTableInfo.js.map