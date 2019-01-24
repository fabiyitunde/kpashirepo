"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registrationRoutes_1 = require("./registrationRoutes");
exports.initRoutes = app => {
    var regroute = new registrationRoutes_1.registrationRoutes();
    regroute.routes(app);
};
//# sourceMappingURL=index.js.map