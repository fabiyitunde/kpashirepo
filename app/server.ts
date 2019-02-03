import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as cors from "cors";
import { initHandlers } from "./eventhandlers/index";
import { initRoutes } from "./routes/index";
import * as socketio from "socket.io";
const PORT = 3890;
const mongoUrl: string = "mongodb://localhost/kpashidatabase";
var app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// initHandlers(this.app);
app.use(bodyParser.json());
//support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
initRoutes(app);

mongoose.connect(
  mongoUrl,
  { useNewUrlParser: true }
);

var server = app.listen(PORT, () => {
  console.log("Express server listening on port... " + PORT);
});
var io = socketio().listen(server);
initHandlers(io);
