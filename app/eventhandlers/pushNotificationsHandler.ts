import * as postal from "postal";
import {
  postalChannels,
  postalTopics,
  clientSideHandlerAddresses,
  clientSideReducerActions
} from "../param";
import * as PQueue from "p-queue";
import { sendNotification } from "../utilities/pushNotificationsProvider";
const queue = new PQueue({ concurrency: 1 });
export const initializePushNotifications = () => {
  const channel = postal.channel(postalChannels.kpashiChannel);
  channel.subscribe(postalTopics.tableInvitation, eventobj => {
    queue.add(() =>
      Promise.resolve(sendInvitationPushNotification(eventobj)).then(() => {
        console.log("Done: Sending Notifications");
      })
    );
  });
};

const sendInvitationPushNotification = (eventobj: any) => {
  var { tableinfo, hostuserinfo, guestuserinfo } = eventobj;
  const title: string = hostuserinfo.fullname + " Invitation Is Waiting";
  const message: string = `Accept Invitation to Kpashi Table ${
    tableinfo.description
  }`;
  (async () => {
    await sendNotification(guestuserinfo.id, title, message, {
      tableid: tableinfo.id
    });
  })();
};
