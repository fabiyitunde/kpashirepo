"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.KpashiGameInfoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: "Game Id is required"
    },
    kpashitableid: {
        type: String
    },
    playerlist: {
        type: [
            {
                playerid: String,
                playername: String,
                winposition: Number,
                sittingposition: Number,
                creditbalance: Number,
                cards: [{ suittype: Number, cardtype: Number }],
                cardsaffectedbycallingcards: [{ suittype: Number, cardtype: Number }]
            }
        ]
    },
    playingcards: {
        type: [{ suittype: Number, cardtype: Number }]
    },
    deckofcards: {
        type: [{ position: Number, suittype: Number, cardtype: Number }]
    },
    unitsperhand: {
        type: Number
    },
    gamestatus: {
        type: Number
    },
    startedAt: {
        type: Date
    },
    startTime: {
        type: String
    },
    lastplayerposition: {
        type: Number
    },
    openedcards: {
        type: [{ position: Number, suittype: Number, cardtype: Number }]
    },
    callingcard: {
        type: { suittype: Number, cardtype: Number }
    },
    nextplayerdetail: { type: { playerid: String, playername: String } },
    droppedcards: [{ playerid: String, suittype: Number, cardtype: Number }],
    firsttopick: { playerid: String, suittype: Number, cardtype: Number },
    pickupsequence: [{ position: Number, playerid: String }],
    gameresults: [{ playerid: String, score: Number, position: Number }]
});
//# sourceMappingURL=kpashiGameInfo.js.map