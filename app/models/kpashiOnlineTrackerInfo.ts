import * as mongoose from "mongoose";
import { KpashiPlayer } from "./kpashiPlayer";
export const kpashiOnlineTrackerInfoSchema = new mongoose.Schema({
  socketid: {
    type: String,
    required: "name is required"
  },
  userid: {
    type: String,
    required: "name is required"
  },
  connectiontime: {
    type: Date
  },
  kpashiPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KpashiPlayer"
  }
});
const kpashiOnlineTrackerInfo = mongoose.model(
  "kpashiOnlineTrackerInfo",
  kpashiOnlineTrackerInfoSchema
);
export const insertOnlineTrackerRecord = async (userid, socketid) => {
  var existingrec: any = await kpashiOnlineTrackerInfo.findOne({
    socketid: socketid
  });
  if (existingrec != null && existingrec != undefined) return;
  var playerinfo: any = await KpashiPlayer.findOne({ id: userid });
  var newrec = new kpashiOnlineTrackerInfo({
    socketid: socketid,
    userid: userid,
    connectiontime: new Date(),
    kpashiPlayer: playerinfo._id
  });

  await newrec.save();
};
export const deleteTrackerRecord = async socketid => {
  await kpashiOnlineTrackerInfo.deleteMany({ socketid: socketid });
};
