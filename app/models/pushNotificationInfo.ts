import * as mongoose from "mongoose";
const pushNotificationMessageSchema = new mongoose.Schema({
  tokenid: {
    type: String,
    required: "name is required"
  },
  ticketid: {
    type: String,
    required: "name is required"
  },
  message: {
    type: String
  },
  isprocessed: {
    type: Boolean
  },
  senddate: {
    type: Date
  }
});
export const pushNotificationsInfoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: "id is required"
  },
  tokenid: {
    type: String,
    required: "name is required"
  },
  messages: [pushNotificationMessageSchema],
  isallowed: {
    type: Boolean
  },
  lastsenddate: {
    type: Date
  },
  lastsentTicketid: {
    type: String
  },
  lasterrormsg: {
    type: String
  }
});
