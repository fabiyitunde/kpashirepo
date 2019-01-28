"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientSocketHandler_1 = require("./clientSocketHandler");
exports.initHandlers = app => {
    new clientSocketHandler_1.clientSocketHandler(app);
};
//# sourceMappingURL=index.js.map