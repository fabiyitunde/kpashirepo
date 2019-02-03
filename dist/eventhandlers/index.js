"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientSocketHandler_1 = require("./clientSocketHandler");
let clientsocket;
exports.initHandlers = io => {
    clientsocket = new clientSocketHandler_1.clientSocketHandler(io);
};
//# sourceMappingURL=index.js.map