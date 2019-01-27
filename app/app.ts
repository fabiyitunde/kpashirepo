import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";

import { initRoutes } from "./routes/index";
class App {
  public app: express.Application;
  public mongoUrl: string = "mongodb://localhost/kpashidatabase";
  constructor() {
    this.app = express();
    this.config();

    initRoutes(this.app);
    this.mongoSetup();
    console.log("Last Connect");
  }

  private config(): void {
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
