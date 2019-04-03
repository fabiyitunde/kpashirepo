"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameEventHandler_1 = require("./socketio/gameEventHandler");
const pushNotificationsHandler_1 = require("./pushNotificationsHandler");
const tableEventHandlers_1 = require("./socketio/tableEventHandlers");
let clientsocket;
exports.initHandlers = io => {
    clientsocket = new gameEventHandler_1.clientSocketHandler(io);
    tableEventHandlers_1.initializeTableEventSocketHandlers(io);
    pushNotificationsHandler_1.initializePushNotifications();
};
//# sourceMappingURL=index.js.map