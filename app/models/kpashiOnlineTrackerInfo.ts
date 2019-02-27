import * as mongoose from "mongoose";

const kpashiOnlineTrackerInfoSchema = new mongoose.Schema({
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
  }
});
const kpashiOnlineTrackerInfo = mongoose.model(
  "kpashiOnlineTrackerInfo",
  kpashiOnlineTrackerInfoSchema
);
export const insertOnlineTrackerRecord = async (userid, socketid) => {
  var newrec = new kpashiOnlineTrackerInfo({
    socketid: socketid,
    userid: userid,
    connectiontime: new Date()
  });
  await newrec.save();
};
export const deleteTrackerRecord = async socketid => {
  await kpashiOnlineTrackerInfo.deleteMany({ socketid: socketid });
};
