"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const index_1 = require("./routes/index");
class App {
    constructor() {
        this.mongoUrl = "mongodb://localhost/kpashidatabase";
        this.app = express();
        this.app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
        // initHandlers(this.app);
        this.config();
        index_1.initRoutes(this.app);
        this.mongoSetup();
        console.log("Last Connect");
    }
    config() {
        // this.app.use(function(req, res, next) {
        //   console.log("Request Details ", req);
        //   next();
        // });
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    mongoSetup() {
        // mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map