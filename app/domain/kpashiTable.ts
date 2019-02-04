import { PlayerDetail } from "./playerDetail";
import { KpashiGame } from "./kpashiGame";
import * as linq from "linq";
import { Player } from "./player";
import { getRandomInt } from "../utilities/randomNumberGen";
import { Queue } from "queue-typescript";
export class KpashiTable {
  id: string;
  hostplayer: PlayerDetail = new PlayerDetail();
  unitperround: number;
  playerlist: PlayerDetail[] = [];
  gameisOn: boolean;
  currentGameId: string;
  description: string;
  createdon: Date;
  playingqueue: Queue<string> = new Queue<string>();
  create(
    id: string,
    hostplayerid: string,
    hostplayername: string,
    unitperround: number,
    creditbalance: number,
    description: string
  ) {
    if (creditbalance < unitperround) throw "not enough credit to play";
    this.hostplayer.sittingposition = 1;
    this.hostplayer.playerid = hostplayerid;
    this.hostplayer.playername = hostplayername;
    this.hostplayer.creditbalance = creditbalance;
    this.hostplayer.lastactivity = new Date();
    this.id = id;
    this.description = description;
    this.unitperround = unitperround;
    this.playerlist.push(this.hostplayer);
    this.createdon = new Date();
    this.playingqueue.enqueue(hostplayerid);
  }
  addplayer(playerid: string, fullname: string, creditvalue: number) {
    var existingplayer = this.playerlist.find(p => p.playerid === playerid);
    if (existingplayer) {
      throw "Already Registered In Group";
    }
    if (this.playerlist.length === 7)
      throw "Maximum Number Of Players Is Seven";
    if (this.gameisOn) throw "Cannot Join Table In The Middle Of A Game";
    if (creditvalue < this.unitperround) throw "Not Enough Credit To Play";
    let player = new PlayerDetail();
    player.playerid = playerid;
    player.playername = fullname;
    player.sittingposition = this.playerlist.length + 1;
    player.creditbalance = creditvalue;
    player.lastactivity = new Date();
    this.playerlist.push(player);
    this.playingqueue.enqueue(playerid);
  }
  removeplayer(playerid: string) {
    var existingplayer = this.playerlist.find(p => p.playerid === playerid);
    if (!existingplayer || existingplayer === undefined) {
      throw "Already Removed From Table";
    }
    if (this.gameisOn) throw "Cannot Leave the Table In The Middle Of A Game";
    this.playerlist = this.playerlist.filter(a => a.playerid !== playerid);
    this.playerlist.forEach(a => {
      a.sittingposition = a.sittingposition - 1;
      if (a.sittingposition == 0) a.sittingposition = this.playerlist.length;
    });
    var temque: Queue<string> = new Queue<string>();
    while (this.playingqueue.length > 0) {
      var currentplayerid = this.playingqueue.dequeue();
      if (currentplayerid == playerid) continue;
      temque.enqueue(currentplayerid);
    }
    this.playingqueue = temque;
  }
  topupcredit(playerid: string, credit: number) {
    var existingplayer = this.playerlist.find(p => p.playerid === playerid);
    if (existingplayer == null || existingplayer == undefined) {
      if (this.hostplayer.playerid == playerid) {
        this.addplayer(
          this.hostplayer.playerid,
          this.hostplayer.playername,
          credit
        );
      }
    } else {
      existingplayer.creditbalance += credit;
    }
  }
  shufflesittingpositions() {
    for (let position = 0; position < 200; position++) {
      var player1position = getRandomInt(1, this.playerlist.length);
      var player2position = getRandomInt(1, this.playerlist.length);
      var player1 = this.playerlist.find(
        a => a.sittingposition == player1position
      );
      var player2 = this.playerlist.find(
        a => a.sittingposition == player2position
      );
      player1.sittingposition = player2position;
      player2.sittingposition = player1position;
    }
  }
  setnexttoplay() {
    var temque: Queue<string> = new Queue<string>();
    var currentfirstToPlayid = this.playingqueue.front;
    while (this.playingqueue.length > 0) {
      var currentplayerid = this.playingqueue.dequeue();
      if (currentplayerid == currentfirstToPlayid) continue;
      temque.enqueue(currentplayerid);
    }
    temque.enqueue(currentfirstToPlayid);
    this.playingqueue = temque;
  }
  gameEnded(kpashiGame: KpashiGame) {
    this.gameisOn = false;
    var losers = linq.from(kpashiGame.gameresults).where(a => a.position != 1);
    var winners = linq.from(kpashiGame.gameresults).where(a => a.position == 1);
    var amounttoshare = losers.count() * kpashiGame.unitsperhand;
    var amountforwinner = amounttoshare / winners.count();
    this.playerlist.forEach(player => {
      var existingloser = losers.firstOrDefault(
        a => a.player.playerid == player.playerid
      );
      var existingwinner = winners.firstOrDefault(
        a => a.player.playerid == player.playerid
      );
      if (existingloser != null)
        player.creditbalance -= kpashiGame.unitsperhand;
      if (existingwinner != null) player.creditbalance += amountforwinner;
    });
    var listofmemberstoremove = linq
      .from(this.playerlist)
      .where(a => a.creditbalance < this.unitperround);
    listofmemberstoremove.forEach(member => {
      this.removeplayer(member.playerid);
    });
    if (listofmemberstoremove.count() == 0) this.setnexttoplay();
  }
  pickfirstToPlay() {
    for (let index = 0; index < 200; index++) {
      var player1position = getRandomInt(1, this.playerlist.length);
      var player2position = getRandomInt(1, this.playerlist.length);

      if (player1position == player2position) continue;
      var player1 = linq
        .from(this.playerlist)
        .firstOrDefault(a => a.sittingposition == player1position);
      var player2 = linq
        .from(this.playerlist)
        .firstOrDefault(a => a.sittingposition == player2position);
      player1.sittingposition = player2position;
      player2.sittingposition = player1position;
    }
  }
  createKpashiGame(gameid: string): KpashiGame {
    if (this.gameisOn) throw "An Existing Game is Still InConclusive";
    if (this.playerlist.length <= 1) throw "Minimum Of Two players Required";
    var newgame: KpashiGame = new KpashiGame();
    newgame.initialize(gameid, this.id, this.unitperround);
    this.gameisOn = true;
    this.currentGameId = gameid;
    // this.pickfirstToPlay();
    var sittingposition: number = 0;
    for (let playerid of this.playingqueue) {
      var player = this.playerlist.find(a => a.playerid == playerid);
      if (player.creditbalance >= this.unitperround) {
        sittingposition += 1;
        var newplayer: Player = new Player();
        newplayer.creditbalance = player.creditbalance;
        newplayer.playerid = player.playerid;
        newplayer.playername = player.playername;
        newplayer.sittingposition = sittingposition;
        newplayer.winposition = 0;
        newgame.enrollplayer(newplayer);
      }
    }

    if (newgame.playerlist.length < 2) throw "players must be more than 1";
    return newgame;
  }
  playerAlreadyExist(playerid: string): boolean {
    var existingplayer = this.playerlist.find(a => a.playerid == playerid);
    return existingplayer != null && existingplayer != undefined;
  }
  registerActivity(playerid: string) {
    var existingrec = this.playerlist.find(a => a.playerid == playerid);
    existingrec.lastactivity = new Date();
  }
  createKpashiGameWithPlayerIdOfFirstPlayer(
    gameid: string,
    playerid: string
  ): KpashiGame {
    if (this.gameisOn) throw "An Existing Game is Still InConclusive";
    if (this.playerlist.length <= 1) throw "Minimum Of Two players Required";
    var nextplayerid = this.playingqueue.front;
    if (nextplayerid != playerid) throw "its not your turn to play";
    var newgame: KpashiGame = new KpashiGame();
    newgame.initialize(gameid, this.id, this.unitperround);
    this.gameisOn = true;
    this.currentGameId = gameid;
    var sittingposition: number = 0;
    for (let playeridinqueue of this.playingqueue) {
      var player = this.playerlist.find(a => a.playerid == playeridinqueue);
      if (player.creditbalance >= this.unitperround) {
        sittingposition += 1;
        var newplayer: Player = new Player();
        newplayer.creditbalance = player.creditbalance;
        newplayer.playerid = player.playerid;
        newplayer.playername = player.playername;
        newplayer.sittingposition = sittingposition;
        newplayer.winposition = 0;
        newgame.enrollplayer(newplayer);
      }
    }
    if (newgame.playerlist.length < 2) throw "players must be more than 1";
    return newgame;
  }
}
