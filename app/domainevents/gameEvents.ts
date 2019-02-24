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
export const raiseCardDroppedEvent = (
  gameid: string,
  userinfo: any,
  tableinfo: any
) => {
  var eventobj: any = {};
  eventobj.gameid = gameid;
  eventobj.userinfo = userinfo;
  eventobj.tableinfo = tableinfo;
  const channel = postal.channel(postalChannels.kpashiChannel);
  channel.publish(postalTopics.cardDropped, eventobj);
};

export const raiseNewGameStartedEvent = async (
  gameid: string,
  userinfo: any
) => {
  var eventobj: any = {};
  eventobj.gameid = gameid;
  eventobj.userinfo = userinfo;
  const channel = postal.channel(postalChannels.kpashiChannel);
  channel.publish(postalTopics.newGameStarted, eventobj);
};
export const raiseIAmReadyToPlayEvent = async (
  tableinfo: any,
  userinfo: any
) => {
  var eventobj: any = {};
  eventobj.tableinfo = tableinfo;
  eventobj.userinfo = userinfo;
  const channel = postal.channel(postalChannels.kpashiChannel);
  channel.publish(postalTopics.iAmReadyToPlay, eventobj);
};

export const raiseCurrentGameCancelledEvent = (
  tableinfo: any,
  userinfo: any,
  gameid: string
) => {
  var eventobj: any = {};
  eventobj.tableinfo = tableinfo;
  eventobj.userinfo = userinfo;
  eventobj.gameid = gameid;
  const channel = postal.channel(postalChannels.kpashiChannel);
  channel.publish(postalTopics.currentGameCancelled, eventobj);
};
