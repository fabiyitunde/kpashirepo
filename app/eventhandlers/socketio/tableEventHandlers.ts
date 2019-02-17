import * as postal from "postal";
var uuid = require("uuid/v5");
var uniqid = require("uniqid");

import {
  postalChannels,
  postalTopics,
  clientSideHandlerAddresses,
  clientSideReducerActions
} from "../../param";

export const initializeTableEventSocketHandlers = io => {
  const channel = postal.channel(postalChannels.kpashiChannel);
  channel.subscribe(postalTopics.tableInvitation, eventobj => {
    sendTableInvite(eventobj, io);
  });
  channel.subscribe(postalTopics.tableInvitationAcceptance, eventobj =>
    sendTableInvitationAcceptance(eventobj, io)
  );
  channel.subscribe(postalTopics.playertoppedUpCredit, eventobj =>
    onClientToppedUpCredit(eventobj, io)
  );
  channel.subscribe(postalTopics.playerRemovedFromTable, eventobj =>
    onPlayerRemovedFromTable(eventobj, io)
  );
};

const sendTableInvite = (eventobj, io) => {
  var { tableinfo, hostuserinfo, guestuserinfo } = eventobj;
  var returnobj: any = {};
  returnobj.payload = tableinfo;
  returnobj.address = clientSideHandlerAddresses.tableinvite;
  returnobj.source = hostuserinfo;
  returnobj.description = "Table Invitation Needs Your Attention";
  returnobj.time = new Date().toString();
  const uniqueid = uniqid();
  returnobj.id = uuid(uniqueid, uuid.DNS);
  var eventname = "userevent" + guestuserinfo.id;
  io.emit(eventname, returnobj);
};
const sendTableInvitationAcceptance = (eventobj, io) => {
  var { tableinfo, userinfo } = eventobj;
  var members: any[] = tableinfo.members;
  members.forEach(player => {
    if (player.id != userinfo.id) {
      var returnobj: any = {};
      returnobj.payload = tableinfo;
      returnobj.address = clientSideHandlerAddresses.tableinviteResponse;
      returnobj.source = userinfo;
      returnobj.description = userinfo.fullname + " just joined the Table";
      returnobj.time = new Date().toString();
      returnobj.id = uuid(uniqid(), uuid.DNS);
      returnobj.reduceraction = clientSideReducerActions.playerjoinedtable;
      var eventname = "userevent" + player.id;
      io.emit(eventname, returnobj);
    }
  });
};
const onClientToppedUpCredit = (eventobj, io) => {
  var { tableinfo, userinfo } = eventobj;
  var members: any[] = tableinfo.members;
  members.forEach(player => {
    if (player.id != userinfo.id) {
      var returnobj: any = {};
      returnobj.payload = tableinfo;
      returnobj.address = clientSideHandlerAddresses.tableinviteResponse;
      returnobj.source = userinfo;
      returnobj.description = userinfo.fullname + " just Topped Up Credit";
      returnobj.time = new Date().toString();
      returnobj.id = uuid(uniqid(), uuid.DNS);
      returnobj.reduceraction = clientSideReducerActions.playertoppedUpCredit;
      var eventname = "userevent" + player.id;
      io.emit(eventname, returnobj);
    }
  });
};

const onPlayerRemovedFromTable = (eventobj, io) => {
  var { tableinfo, removeplayerinfo } = eventobj;
  var returnobj: any = {};
  returnobj.payload = eventobj;
  returnobj.address = clientSideHandlerAddresses.playerRemovedFromTable;
  returnobj.source = eventobj.hostplayerinfo;
  returnobj.description =
    eventobj.hostplayerinfo.fullname +
    " just Removed You From Table " +
    tableinfo.description;
  returnobj.time = new Date().toString();
  returnobj.id = uuid(uniqid(), uuid.DNS);
  returnobj.reduceraction = clientSideReducerActions.playertoppedUpCredit;
  var eventname = "userevent" + removeplayerinfo.id;
  io.emit(eventname, returnobj);
};
