import { Request, Response, NextFunction } from "express";
import { RegistrationController } from "../controllers/registrationController";
export class registrationRoutes {
  public registrationController: RegistrationController = new RegistrationController();
  public routes(app) {
    app
      .route("/registration/createuser")
      .post(this.registrationController.createuser);
    app
      .route("/registration/createTable")
      .post(this.registrationController.createTable);
    app
      .route("/registration/sendTableInvite")
      .post(this.registrationController.sendTableInvite);
    app
      .route("/registration/joinTable")
      .post(this.registrationController.joinTable);
    app
      .route("/registration/topUpCredit")
      .post(this.registrationController.topUpCredit);
    app
      .route("/registration/getMyTableList/:userid")
      .get(this.registrationController.getMyTableList);
    app
      .route("/registration/getAllUsersList")
      .get(this.registrationController.getAllUsersList);
    app.route("/registration/logIn").get(this.registrationController.logIn);
    app
      .route("/registration/registerUser")
      .get(this.registrationController.registerUser);
  }
}
