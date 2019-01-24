import { registrationRoutes } from "./registrationRoutes";
export const initRoutes = app => {
  var regroute = new registrationRoutes();
  regroute.routes(app);
};
