import Expo from "expo-server-sdk";
import * as mongoose from "mongoose";
import { pushNotificationsInfoSchema } from "../models/pushNotificationInfo";
const pushNotificationsInfo = mongoose.model(
  "pushNotificationsInfo",
  pushNotificationsInfoSchema
);
export const sendNotification = async (
  userid: string,
  title: string,
  message: string,
  params: any
) => {
  let expo = new Expo();
  var pushnotificationinfo: any = await pushNotificationsInfo.findOne({
    id: userid
  });
  if (pushnotificationinfo == null) return;
  if (pushnotificationinfo.isallowed == false) return;
  var pushnotificationinfomessages: any[] = pushnotificationinfo.messages;
  if (!Expo.isExpoPushToken(pushnotificationinfo.tokenid)) {
    const errormsg = `Push token ${
      pushnotificationinfo.tokenid
    } is not a valid Expo push token`;
    await pushNotificationsInfo.findOneAndUpdate(
      { id: userid },
      {
        lasterrormsg: errormsg
      }
    );
    return;
  }
  let messages = [];
  messages.push({
    to: pushnotificationinfo.tokenid,
    sound: "default",
    body: message,
    title: title,
    data: params
  });
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
      } catch (error) {
        console.error(error);
      }
    }
  })();
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      pushnotificationinfomessages.push({
        tokenid: pushnotificationinfo.tokenid,
        ticketid: ticket.id,
        message: message,
        isprocessed: false,
        senddate: new Date()
      });
    }
  }
  pushnotificationinfo.messages = pushnotificationinfomessages;
  await pushNotificationsInfo.findOneAndUpdate(
    { id: userid },
    pushnotificationinfo,
    { upsert: false }
  );
};

export const registerUserForNotifications = async (
  userid: string,
  tokenid: string
) => {
  var pushnotificationinfo: any = await pushNotificationsInfo.findOne({
    id: userid
  });
  if (pushnotificationinfo == null || pushnotificationinfo == undefined) {
    var newinfo: any = {};
    newinfo.id = userid;
    newinfo.tokenid = tokenid;
    newinfo.messages = [];
    newinfo.isallowed = true;
    newinfo.lastsenddate = new Date();
    newinfo.lastsentTicketid = "";
    newinfo.lasterrormsg = "";
    var newrow = new pushNotificationsInfo(newinfo);
    newrow.save();
  } else {
    if (pushnotificationinfo.tokenid != tokenid) {
      await pushNotificationsInfo.findOneAndUpdate(
        { id: userid },
        pushnotificationinfo,
        { upsert: false }
      );
    }
  }
};
