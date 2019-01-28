"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.KpashiPlayer = mongoose.model("KpashiPlayer", new mongoose.Schema({
    id: {
        type: String,
        required: "id is required"
    },
    fullname: {
        type: String,
        required: "Enter a full name"
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    photourl: {
        type: String
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    lastactivitytime: {
        type: Date,
        default: Date.now
    }
}));
exports.KpashiPlayer = exports.KpashiPlayer;
//# sourceMappingURL=kpashiPlayer.js.map