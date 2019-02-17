import { clientSocketHandler } from "./socketio/gameEventHandler";
import { initializePushNotifications } from "./pushNotificationsHandler";
import { initializeTableEventSocketHandlers } from "./socketio/tableEventHandlers";
let clientsocket: clientSocketHandler;
export const initHandlers = io => {
  clientsocket = new clientSocketHandler(io);
  initializeTableEventSocketHandlers(io);
  initializePushNotifications();
};
