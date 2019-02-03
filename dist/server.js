"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const index_1 = require("./eventhandlers/index");
const index_2 = require("./routes/index");
const socketio = require("socket.io");
const PORT = 3890;
const mongoUrl = "mongodb://localhost/kpashidatabase";
var app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// initHandlers(this.app);
app.use(bodyParser.json());
//support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
index_2.initRoutes(app);
mongoose.connect(mongoUrl, { useNewUrlParser: true });
var server = app.listen(PORT, () => {
    console.log("Express server listening on port... " + PORT);
});
var io = socketio().listen(server);
index_1.initHandlers(io);
//# sourceMappingURL=server.js.map