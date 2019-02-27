import * as mongoose from "mongoose";
import { KpashiPlayer } from "../models/kpashiPlayer";
import { kpashiOnlineTrackerInfoSchema } from "../models/kpashiOnlineTrackerInfo";
const kpashiOnlineTrackerInfo = mongoose.model(
  "kpashiOnlineTrackerInfo",
  kpashiOnlineTrackerInfoSchema
);
export const getOnlineUsers = async () => {
  var resultlist: any[] = [];
  var queryresultlist: any[] = await kpashiOnlineTrackerInfo.find();
  if (queryresultlist == null || queryresultlist.length == 0) return resultlist;
  for (let index = 0; index < queryresultlist.length; index++) {
    const queryresult = queryresultlist[index];
    const user: any = await KpashiPlayer.findOne({ id: queryresult.userid });
    var existingrec = resultlist.find(a => a.id == user.id);
    if (existingrec != null && existingrec != undefined) continue;
    var player: any = {};
    player.id = user.id;
    player.address = user.address;
    player.email = user.email;
    player.fullname = user.fullname;
    player.phone = user.phone;
    player.photourl = user.photourl;
    player.registrationDate = user.registrationDate;
    resultlist.push(player);
  }
  return resultlist;
};
