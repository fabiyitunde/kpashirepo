import * as postal from "postal";
var datetime = require("node-datetime");
var uuid = require("uuid/v5");
var uniqid = require("uniqid");
import {
  postalChannels,
  postalTopics,
  clientSideHandlerAddresses,
  clientSideReducerActions
} from "../../param";
import { getGameInfo } from "../../queries/getGameInfo";
import { getMyGameDetails } from "../../queries/getMyGameDetails";
export class clientSocketHandler {
  constructor(io) {
    const channel = postal.channel(postalChannels.kpashiChannel);

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
    channel.subscribe(postalTopics.currentGameCancelled, eventobj => {
      this.onCurrentGameCancelled(eventobj, io)
        .then(() => {})
        .catch(err => {});
    });
    channel.subscribe(postalTopics.iAmReadyToPlay, eventobj => {
      this.onPlayerIsReadyToPlay(eventobj, io)
        .then(() => {})
        .catch(err => {});
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
  async onCurrentGameCancelled(eventobj, io) {
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
      returnobj.address = clientSideHandlerAddresses.currentGameCancelled;
      returnobj.source = eventobj.userinfo;
      returnobj.description =
        eventobj.userinfo.fullname +
        " just Cancelled Current Game on " +
        eventobj.tableinfo.description;
      returnobj.time = new Date().toString();
      returnobj.id = uuid(uniqid(), uuid.DNS);
      returnobj.reduceraction = clientSideHandlerAddresses.currentGameCancelled;
      var eventname = "userevent" + player.playerid;
      io.emit(eventname, returnobj);
    }
  }
  async onPlayerIsReadyToPlay(eventobj, io) {
    const { tableinfo, userinfo } = eventobj;
    var gameinfo: any = await getGameInfo(tableinfo.currentGameId);
    var playerlist: any[] = gameinfo.playerlist;
    for (let index = 0; index < playerlist.length; index++) {
      const player = playerlist[index];
      if (player.playerid == userinfo.id) continue;
      var mygamedetails = await getMyGameDetails(
        player.playerid,
        tableinfo.currentGameId
      );
      var returnobj: any = {};
      returnobj.gameinfo = mygamedetails;
      returnobj.tableinfo = eventobj.tableinfo;
      returnobj.address = clientSideHandlerAddresses.playerIsReadyToplay;
      returnobj.source = userinfo;
      returnobj.description =
        eventobj.userinfo.fullname +
        " Is Now Ready To Play " +
        tableinfo.description;
      returnobj.time = new Date().toString();
      returnobj.id = uuid(uniqid(), uuid.DNS);
      returnobj.reduceraction = clientSideHandlerAddresses.playerIsReadyToplay;
      var eventname = "userevent" + player.playerid;
      io.emit(eventname, returnobj);
    }
  }
}
