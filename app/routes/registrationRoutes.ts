import { Request, Response, NextFunction } from "express";
import { RegistrationController } from "../controllers/registrationController";
export class registrationRoutes {
  public registrationController: RegistrationController = new RegistrationController();
  public routes(app): void {
    app
      .route("/registration/create")
      .post(this.registrationController.createuser);
  }
}
