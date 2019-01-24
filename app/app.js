"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var index_1 = require("./routes/index");
var App = /** @class */ (function () {
    function App() {
        this.mongoUrl = "mongodb://localhost/kpashidatabase";
        this.app = express();
        this.config();
        index_1.initRoutes(this.app);
        this.mongoSetup();
        console.log("Last Connect");
    }
    App.prototype.config = function () {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    };
    App.prototype.mongoSetup = function () {
        // mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    };
    return App;
}());
exports["default"] = new App().app;
