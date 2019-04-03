import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as cors from "cors";
import { initHandlers } from "./eventhandlers/index";
import { initRoutes } from "./routes/index";
import * as socketio from "socket.io";
import * as config from "config";
import {
  insertOnlineTrackerRecord,
  deleteTrackerRecord
} from "./models/kpashiOnlineTrackerInfo";
const PORT = process.env.PORT || 80;
const mongoUrl: string = "mongodb://localhost/kpashidatabase";

var app = express();
//app.use(cors({ credentials: true, origin: config.get("clientaddress") }));
app.use(cors());
// initHandlers(this.app);
app.use(bodyParser.json());
//support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
initRoutes(app);

mongoose.connect(config.get("dbconstring"), { useNewUrlParser: true });

var server = app.listen(PORT, () => {
  console.log("Express server listening on port... " + PORT);
  console.log("Db Connection...connection changed", config.get("dbconstring"));
});
var io = socketio();
io.on("connection", client => {
  client.on("send", message => {
    message.servertime = new Date();
    io.emit(message.address, message);
  });
  client.on("amOnLine", userid =>
    (async () => await insertOnlineTrackerRecord(userid, client.id))()
  );
  client.on("disconnect", () => {
    (async () => await deleteTrackerRecord(client.id))();
  });
});
io.listen(server);
initHandlers(io);
