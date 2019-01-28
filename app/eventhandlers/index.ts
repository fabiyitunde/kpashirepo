import { clientSocketHandler } from "./clientSocketHandler";
export const initHandlers = app => {
  new clientSocketHandler(app);
};
