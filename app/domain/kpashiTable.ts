import { PlayerDetail } from "./playerDetail";
import { KpashiGame } from "./kpashiGame";
import * as linq from "linq";
export class KpashiTable {
  id: string;
  hostplayer: PlayerDetail = new PlayerDetail();
  unitperround: number;
  playerlist: PlayerDetail[] = [];
  gameisOn: boolean;

  create(
    id: string,
    hostplayerid: string,
    hostplayername: string,
    unitperround: number,
    creditbalance: number
  ) {
    if (creditbalance < unitperround) throw "not enough credit to play";
    this.hostplayer.sittingposition = 1;
    this.hostplayer.playerid = hostplayerid;
    this.hostplayer.playername = hostplayername;
    this.hostplayer.creditbalance = creditbalance;
    this.id = id;
    this.unitperround = unitperround;
    this.playerlist.push(this.hostplayer);
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
}
