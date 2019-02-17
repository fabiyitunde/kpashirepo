import * as mongoose from "mongoose";
import { KpashiTableInfoSchema } from "../models/kpashiTableInfo";
import { KpashiPlayer } from "../models/kpashiPlayer";
import * as linq from "linq";
const KpashiTableInfo = mongoose.model(
  "KpashiTableInfo",
  KpashiTableInfoSchema
);

export const getTableInfo = async tableid => {
  var newtableinfo: any = {};
  var tableinfo: any = await KpashiTableInfo.findOne({ tableid: tableid });
  var hostplayerinfo: any = await KpashiPlayer.findOne({
    id: tableinfo.hostplayer.playerid
  });
  newtableinfo.id = tableinfo.tableid;
  newtableinfo.description = tableinfo.description;
  newtableinfo.hostname = tableinfo.hostplayer.name;
  newtableinfo.hostphotourl = hostplayerinfo.photourl;
  newtableinfo.hostplayerid = tableinfo.hostplayer.playerid;
  newtableinfo.oneroundunit = tableinfo.unitperround;
  newtableinfo.currentGameId = tableinfo.currentGameId;
  newtableinfo.isOn = tableinfo.gameison;
  newtableinfo.createOn = tableinfo.createdon;
  var playerlist: any[] = tableinfo.playerlist;
  if (playerlist.length > 0) {
    var filterlist = linq
      .from(playerlist)
      .select(player => {
        var ret: any = { id: player.playerid };
        return ret;
      })
      .toArray();
    var playerinfolist: any[] = await KpashiPlayer.find({
      $or: [...filterlist]
    });
    newtableinfo.membercount = playerlist.length;
    var memberlist: any[] = [];
    playerlist.forEach(async player => {
      var playerinfo: any = playerinfolist.find(a => a.id == player.playerid);
      var newplayer: any = {};
      newplayer.id = player.playerid;
      newplayer.fullname = playerinfo.fullname;
      newplayer.position = player.sittingposition;
      newplayer.unitbalance = player.creditbalance;
      newplayer.photourl = playerinfo.photourl;
      newplayer.lastactivitytime = playerinfo.lastactivitytime;
      newplayer.readytoplay = player.readytoplay;
      memberlist.push(newplayer);
    });
    newtableinfo.members = memberlist;
  } else {
    newtableinfo.members = [];
  }
  return newtableinfo;
};
