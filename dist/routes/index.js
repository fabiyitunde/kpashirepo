"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registrationRoutes_1 = require("./registrationRoutes");
const gameroutes_1 = require("./gameroutes");
exports.initRoutes = app => {
    var regroute = new registrationRoutes_1.registrationRoutes();
    regroute.routes(app);
    gameroutes_1.registerGameRoutes(app);
};
//# sourceMappingURL=index.js.map