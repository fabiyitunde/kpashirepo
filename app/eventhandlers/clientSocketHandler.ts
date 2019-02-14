import * as postal from "postal";
var datetime = require("node-datetime");
var uuid = require("uuid/v5");
var uniqid = require("uniqid");
import {
  postalChannels,
  postalTopics,
  clientSideHandlerAddresses,
  clientSideReducerActions
} from "../param";
import { getGameInfo } from "../queries/getGameInfo";
import { getMyGameDetails } from "../queries/getMyGameDetails";
export class clientSocketHandler {
  constructor(io) {
    const channel = postal.channel(postalChannels.kpashiChannel);
    channel.subscribe(postalTopics.tableInvitation, eventobj => {
      this.sendTableInvite(eventobj, io);
    });
    channel.subscribe(postalTopics.tableInvitationAcceptance, eventobj =>
      this.sendTableInvitationAcceptance(eventobj, io)
    );
    channel.subscribe(postalTopics.playertoppedUpCredit, eventobj =>
      this.onClientToppedUpCredit(eventobj, io)
    );
    channel.subscribe(postalTopics.firstGameStarted, eventobj => {
      this.onFirstGameStarted(eventobj, io)
        .then(() => {})
        .catch(err => {});
    });
    channel.subscribe(postalTopics.shufflingEnded, eventobj => {
      this.onSuffleEnded(eventobj, io)
        .then(() => {})
        .catch(err => {});
    });
    channel.subscribe(postalTopics.dealingCardsComplete, eventobj => {
      this.onDealingCardsComplete(eventobj, io)
        .then(() => {})
        .catch(err => {});
    });
    channel.subscribe(postalTopics.cardDropped, eventobj => {
      this.onCardDropped(eventobj, io)
        .then(() => {})
        .catch(err => {});
    });
    channel.subscribe(postalTopics.newGameStarted, eventobj => {
      this.onNewGameStarted(eventobj, io)
        .then(() => {})
        .catch(err => {});
    });
  }
  sendTableInvite(eventobj, io) {
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
  }
  sendTableInvitationAcceptance(eventobj, io) {
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
  }
  onClientToppedUpCredit(eventobj, io) {
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
  }
  async onFirstGameStarted(eventobj, io) {
    var gameinfo: any = await getGameInfo(eventobj.gameid);
    var playerlist: any[] = gameinfo.playerlist;
    for (let index = 0; index < playerlist.length; index++) {
      const player = playerlist[index];
      if (player.playerid == eventobj.userinfo.id) continue;
      var mygamedetails = await getMyGameDetails(
        player.playerid,
        eventobj.gameid
      );
      var returnobj: any = {};
      returnobj.payload = mygamedetails;
      returnobj.address = clientSideHandlerAddresses.gameViewOpened;
      returnobj.source = eventobj.userinfo;
      returnobj.description =
        eventobj.userinfo.fullname +
        " just Started a New Game with you included";
      returnobj.time = new Date().toString();
      returnobj.id = uuid(uniqid(), uuid.DNS);
      returnobj.reduceraction = clientSideReducerActions.firstGameStarted;
      var eventname = "userevent" + player.playerid;
      io.emit(eventname, returnobj);
    }
  }
  async onSuffleEnded(eventobj, io) {
    var gameinfo: any = await getGameInfo(eventobj.gameid);
    var playerlist: any[] = gameinfo.playerlist;
    for (let index = 0; index < playerlist.length; index++) {
      const player = playerlist[index];
      if (player.playerid == eventobj.userinfo.id) continue;
      var mygamedetails = await getMyGameDetails(
        player.playerid,
        eventobj.gameid
      );
      var returnobj: any = {};
      returnobj.payload = mygamedetails;
      returnobj.address = clientSideHandlerAddresses.gameViewOpened;
      returnobj.source = eventobj.userinfo;
      returnobj.description =
        eventobj.userinfo.fullname + " just Finished Shuffling The Cards";
      returnobj.time = new Date().toString();
      returnobj.id = uuid(uniqid(), uuid.DNS);
      returnobj.reduceraction = clientSideReducerActions.shufflingEnded;
      var eventname = "userevent" + player.playerid;
      io.emit(eventname, returnobj);
    }
  }
  async onDealingCardsComplete(eventobj, io) {
    var gameinfo: any = await getGameInfo(eventobj.gameid);
    var playerlist: any[] = gameinfo.playerlist;
    for (let index = 0; index < playerlist.length; index++) {
      const player = playerlist[index];
      if (player.playerid == eventobj.userinfo.id) continue;
      var mygamedetails = await getMyGameDetails(
        player.playerid,
        eventobj.gameid
      );
      var returnobj: any = {};
      returnobj.payload = mygamedetails;
      returnobj.address = clientSideHandlerAddresses.gameViewOpened;
      returnobj.source = eventobj.userinfo;
      returnobj.description =
        eventobj.userinfo.fullname + " just Finished Dealing The Cards";
      returnobj.time = new Date().toString();
      returnobj.id = uuid(uniqid(), uuid.DNS);
      returnobj.reduceraction = clientSideReducerActions.dealingCardsComplete;
      var eventname = "userevent" + player.playerid;
      io.emit(eventname, returnobj);
    }
  }
  async onCardDropped(eventobj, io) {
    var gameinfo: any = await getGameInfo(eventobj.gameid);

    var playerlist: any[] = gameinfo.playerlist;
    for (let index = 0; index < playerlist.length; index++) {
      const player = playerlist[index];
      if (player.playerid == eventobj.userinfo.id) continue;
      var mygamedetails = await getMyGameDetails(
        player.playerid,
        eventobj.gameid
      );
      var returnobj: any = {};
      returnobj.payload = mygamedetails;
      returnobj.tableinfo = eventobj.tableinfo;
      returnobj.address = clientSideHandlerAddresses.gameViewOpened;
      returnobj.source = eventobj.userinfo;
      returnobj.description =
        eventobj.userinfo.fullname + " just Dropped a Card";
      returnobj.time = new Date().toString();
      returnobj.id = uuid(uniqid(), uuid.DNS);
      returnobj.reduceraction = clientSideReducerActions.cardDropped;
      var eventname = "userevent" + player.playerid;

      io.emit(eventname, returnobj);
    }
  }
  async onNewGameStarted(eventobj, io) {
    var gameinfo: any = await getGameInfo(eventobj.gameid);
    var playerlist: any[] = gameinfo.playerlist;
    for (let index = 0; index < playerlist.length; index++) {
      const player = playerlist[index];
      if (player.playerid == eventobj.userinfo.id) continue;
      var mygamedetails = await getMyGameDetails(
        player.playerid,
        eventobj.gameid
      );
      var returnobj: any = {};
      returnobj.payload = mygamedetails;
      returnobj.address = clientSideHandlerAddresses.gameViewOpened;
      returnobj.source = eventobj.userinfo;
      returnobj.description =
        eventobj.userinfo.fullname +
        " just Started a New Game with you included";
      returnobj.time = new Date().toString();
      returnobj.id = uuid(uniqid(), uuid.DNS);
      returnobj.reduceraction = clientSideReducerActions.firstGameStarted;
      var eventname = "userevent" + player.playerid;
      io.emit(eventname, returnobj);
    }
  }
}
