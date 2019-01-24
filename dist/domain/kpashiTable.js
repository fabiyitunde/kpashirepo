"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playerDetail_1 = require("./playerDetail");
class KpashiTable {
    constructor() {
        this.hostplayer = new playerDetail_1.PlayerDetail();
        this.playerlist = [];
    }
    create(id, hostplayerid, hostplayername, unitperround, creditbalance) {
        if (creditbalance < unitperround)
            throw "not enough credit to play";
        this.hostplayer.sittingposition = 1;
        this.hostplayer.playerid = hostplayerid;
        this.hostplayer.playername = hostplayername;
        this.hostplayer.creditbalance = creditbalance;
        this.id = id;
        this.unitperround = unitperround;
        this.playerlist.push(this.hostplayer);
    }
    addplayer(playerid, fullname, creditvalue) {
        var existingplayer = this.playerlist.find(p => p.playerid === playerid);
        if (existingplayer) {
            throw "Already Registered In Group";
        }
        if (this.playerlist.length === 7)
            throw "Maximum Number Of Players Is Seven";
        if (this.gameisOn)
            throw "Cannot Join Table In The Middle Of A Game";
        if (creditvalue < this.unitperround)
            throw "Not Enough Credit To Play";
        let player = new playerDetail_1.PlayerDetail();
        player.playerid = playerid;
        player.playername = fullname;
        player.sittingposition = this.playerlist.length + 1;
        player.creditbalance = creditvalue;
        this.playerlist.push(player);
    }
    removeplayer(playerid) {
        var existingplayer = this.playerlist.find(p => p.playerid === playerid);
        if (!existingplayer || existingplayer === undefined) {
            throw "Already Removed From Table";
        }
        if (this.gameisOn)
            throw "Cannot Leave the Table In The Middle Of A Game";
        this.playerlist = this.playerlist.filter(a => a.playerid !== playerid);
        this.playerlist.forEach(a => {
            a.sittingposition = a.sittingposition - 1;
            if (a.sittingposition == 0)
                a.sittingposition = this.playerlist.length;
        });
    }
    topupcredit(playerid, credit) {
        var existingplayer = this.playerlist.find(p => p.playerid === playerid);
        existingplayer.creditbalance += credit;
    }
    shufflesittingpositions() {
        for (let position = 0; position < 200; position++) {
            var player1position = Math.floor(Math.random() * Math.floor(this.playerlist.length - 1)) + 1;
            var player2position = Math.floor(Math.random() * Math.floor(this.playerlist.length - 1)) + 1;
            var player1 = this.playerlist.find(a => a.sittingposition == player1position);
            var player2 = this.playerlist.find(a => a.sittingposition == player2position);
            player1.sittingposition = player2position;
            player2.sittingposition = player1position;
        }
    }
    setnexttoplay() {
        this.playerlist.forEach(element => {
            if (element.sittingposition - 1 === 0) {
                element.sittingposition = this.playerlist.length;
            }
            else {
                element.sittingposition -= 1;
            }
        });
    }
}
exports.KpashiTable = KpashiTable;
//# sourceMappingURL=kpashiTable.js.map