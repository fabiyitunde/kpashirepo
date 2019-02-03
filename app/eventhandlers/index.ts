import { clientSocketHandler } from "./clientSocketHandler";
let clientsocket: clientSocketHandler;
export const initHandlers = io => {
  clientsocket = new clientSocketHandler(io);
};
