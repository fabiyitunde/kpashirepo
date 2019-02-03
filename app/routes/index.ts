import { registrationRoutes } from "./registrationRoutes";
import { registerGameRoutes } from "./gameroutes";
export const initRoutes = app => {
  var regroute = new registrationRoutes();
  regroute.routes(app);
  registerGameRoutes(app);
};
