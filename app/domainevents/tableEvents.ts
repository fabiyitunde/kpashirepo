import * as postal from "postal";
import { postalChannels, postalTopics } from "../param";

export const raisePlayerRemovedFromTableEvent = (
  tableinfo: any,
  hostplayerinfo: any,
  removeplayerinfo: any
) => {
  var eventobj: any = {};
  eventobj.tableinfo = tableinfo;
  eventobj.hostplayerinfo = hostplayerinfo;
  eventobj.removeplayerinfo = removeplayerinfo;
  const channel = postal.channel(postalChannels.kpashiChannel);
  channel.publish(postalTopics.playerRemovedFromTable, eventobj);
};
