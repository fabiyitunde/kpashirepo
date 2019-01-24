"use strict";
exports.__esModule = true;
var registrationRoutes_1 = require("./registrationRoutes");
exports.initRoutes = function (app) {
    var regroute = new registrationRoutes_1.registrationRoutes();
    regroute.routes(app);
};
