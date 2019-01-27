import { PlayerDetail } from "./playerDetail";
import { KpashiGame } from "./kpashiGame";
import * as linq from "linq";
import { Player } from "./player";
export class KpashiTable {
  id: string;
  hostplayer: PlayerDetail = new PlayerDetail();
  unitperround: number;
  playerlist: PlayerDetail[] = [];
  gameisOn: boolean;
  currentGameId: string;
  description: string;
  createdon: Date;
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
    this.id = id;
    this.description = description;
    this.unitperround = unitperround;
    this.playerlist.push(this.hostplayer);
    this.createdon = new Date();
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
    this.playerlist.push(player);
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
  }
  topupcredit(playerid: string, credit: number) {
    var existingplayer = this.playerlist.find(p => p.playerid === playerid);
    existingplayer.creditbalance += credit;
  }
  shufflesittingpositions() {
    for (let position = 0; position < 200; position++) {
      var player1position =
        Math.floor(Math.random() * Math.floor(this.playerlist.length - 1)) + 1;
      var player2position =
        Math.floor(Math.random() * Math.floor(this.playerlist.length - 1)) + 1;
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
    this.playerlist.forEach(element => {
      if (element.sittingposition - 1 === 0) {
        element.sittingposition = this.playerlist.length;
      } else {
        element.sittingposition -= 1;
      }
    });
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
    var noninclusivemaxrange = this.playerlist.length + 1;
    for (let index = 0; index < 200; index++) {
      var player1position = Math.random() * (noninclusivemaxrange - 1) + 1;
      var player2position = Math.random() * (noninclusivemaxrange - 1) + 1;
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
    this.pickfirstToPlay();
    this.playerlist.forEach(player => {
      if (player.creditbalance >= this.unitperround) {
        var newplayer: Player = new Player();
        newplayer.creditbalance = player.creditbalance;
        newplayer.playerid = player.playerid;
        newplayer.playername = player.playername;
        newplayer.sittingposition = player.sittingposition;
        newplayer.winposition = 0;
        newgame.enrollplayer(newplayer);
      }
    });
    if (newgame.playerlist.length < 2) throw "players must be more than 1";
    return newgame;
  }
  playerAlreadyExist(playerid: string): boolean {
    var existingplayer = this.playerlist.find(a => a.playerid == playerid);
    return existingplayer != null && existingplayer != undefined;
  }
  createKpashiGameWithPlayerIdOfFirstPlayer(
    gameid: string,
    playerid: string
  ): KpashiGame {
    if (this.gameisOn) throw "An Existing Game is Still InConclusive";
    if (this.playerlist.length <= 1) throw "Minimum Of Two players Required";
    var existingmember = linq
      .from(this.playerlist)
      .firstOrDefault(a => a.playerid == playerid);
    if (existingmember.sittingposition != 1) throw "its not your turn to play";
    var newgame: KpashiGame = new KpashiGame();
    this.gameisOn = true;
    this.currentGameId = gameid;

    this.playerlist.forEach(player => {
      if (player.creditbalance >= this.unitperround) {
        var newplayer: Player = new Player();
        newplayer.creditbalance = player.creditbalance;
        newplayer.playerid = player.playerid;
        newplayer.playername = player.playername;
        newplayer.sittingposition = player.sittingposition;
        newplayer.winposition = 0;
        newgame.enrollplayer(newplayer);
      }
    });
    if (newgame.playerlist.length < 2) throw "players must be more than 1";
    return newgame;
  }
}
