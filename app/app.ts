import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as cors from "cors";

import { initRoutes } from "./routes/index";
import { initHandlers } from "./eventhandlers/index";
class App {
  public app: express.Application;
  public mongoUrl: string = "mongodb://localhost/kpashidatabase";
  constructor() {
    this.app = express();
    this.app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
    // initHandlers(this.app);
    this.config();
    initRoutes(this.app);

    this.mongoSetup();

    console.log("Last Connect");
  }

  private config(): void {
    // this.app.use(function(req, res, next) {
    //   console.log("Request Details ", req);
    //   next();
    // });
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
  private mongoSetup(): void {
    // mongoose.Promise = global.Promise;
    mongoose.connect(
      this.mongoUrl,
      { useNewUrlParser: true }
    );
  }
}

export default new App().app;
