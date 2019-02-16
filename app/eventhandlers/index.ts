import { clientSocketHandler } from "./clientSocketHandler";
import { initializePushNotifications } from "./pushNotificationsHandler";
let clientsocket: clientSocketHandler;
export const initHandlers = io => {
  clientsocket = new clientSocketHandler(io);
  initializePushNotifications();
};
