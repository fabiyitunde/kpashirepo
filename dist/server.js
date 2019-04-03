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
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const index_1 = require("./eventhandlers/index");
const index_2 = require("./routes/index");
const socketio = require("socket.io");
const config = require("config");
const kpashiOnlineTrackerInfo_1 = require("./models/kpashiOnlineTrackerInfo");
const PORT = process.env.PORT || 80;
const mongoUrl = "mongodb://localhost/kpashidatabase";
var app = express();
//app.use(cors({ credentials: true, origin: config.get("clientaddress") }));
app.use(cors());
// initHandlers(this.app);
app.use(bodyParser.json());
//support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
index_2.initRoutes(app);
mongoose.connect(config.get("dbconstring"), { useNewUrlParser: true });
var server = app.listen(PORT, () => {
    console.log("Express server listening on port... " + PORT);
    console.log("Db Connection...connection changed", config.get("dbconstring"));
});
var io = socketio();
io.on("connection", client => {
    client.on("send", message => {
        message.servertime = new Date();
        io.emit(message.address, message);
    });
    client.on("amOnLine", userid => (() => __awaiter(this, void 0, void 0, function* () { return yield kpashiOnlineTrackerInfo_1.insertOnlineTrackerRecord(userid, client.id); }))());
    client.on("disconnect", () => {
        (() => __awaiter(this, void 0, void 0, function* () { return yield kpashiOnlineTrackerInfo_1.deleteTrackerRecord(client.id); }))();
    });
});
io.listen(server);
index_1.initHandlers(io);
//# sourceMappingURL=server.js.map