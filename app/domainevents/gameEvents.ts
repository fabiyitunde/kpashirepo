import * as postal from "postal";
import { postalChannels, postalTopics } from "../param";

export const raiseFirstGameStartedEvent = async (
  gameid: string,
  userinfo: any
) => {
  var eventobj: any = {};
  eventobj.gameid = gameid;
  eventobj.userinfo = userinfo;
  const channel = postal.channel(postalChannels.kpashiChannel);
  channel.publish(postalTopics.firstGameStarted, eventobj);
};
export const raiseShufflingEndedEvent = (gameid: string, userinfo: any) => {
  var eventobj: any = {};
  eventobj.gameid = gameid;
  eventobj.userinfo = userinfo;
  const channel = postal.channel(postalChannels.kpashiChannel);
  channel.publish(postalTopics.shufflingEnded, eventobj);
};
export const raiseDealingCardsCompleteEndedEvent = (
  gameid: string,
  userinfo: any
) => {
  var eventobj: any = {};
  eventobj.gameid = gameid;
  eventobj.userinfo = userinfo;
  const channel = postal.channel(postalChannels.kpashiChannel);
  channel.publish(postalTopics.dealingCardsComplete, eventobj);
};
export const raiseCardDroppedEvent = (gameid: string, userinfo: any) => {
  var eventobj: any = {};
  eventobj.gameid = gameid;
  eventobj.userinfo = userinfo;
  const channel = postal.channel(postalChannels.kpashiChannel);
  channel.publish(postalTopics.cardDropped, eventobj);
};