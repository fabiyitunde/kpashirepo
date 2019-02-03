import * as mongoose from "mongoose";
import { KpashiTableInfoSchema } from "../models/kpashiTableInfo";
import { KpashiPlayer } from "../models/kpashiPlayer";
import * as linq from "linq";
const KpashiTableInfo = mongoose.model(
  "KpashiTableInfo",
  KpashiTableInfoSchema
);

export const getMyTableList = async userid => {
  var resultlist: any[] = [];
  var tablelist: any[] = await KpashiTableInfo.find({
    $or: [{ "hostplayer.playerid": userid }, { "playerlist.playerid": userid }]
  });
  if (tablelist == null || tablelist.length == 0) return resultlist;
  for (let index = 0; index < tablelist.length; index++) {
    const tableinfo = tablelist[index];
    var newtableinfo: any = {};
    newtableinfo.id = tableinfo.tableid;
    newtableinfo.description = tableinfo.description;
    newtableinfo.hostname = tableinfo.hostplayer.name;
    newtableinfo.hostplayerid = tableinfo.hostplayer.playerid;
    newtableinfo.oneroundunit = tableinfo.unitperround;
    newtableinfo.currentGameId = tableinfo.currentGameId;
    newtableinfo.isOn = tableinfo.gameison;
    newtableinfo.createOn = tableinfo.createdon;
    var playerlist: any[] = tableinfo.playerlist;
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
    playerlist.forEach(player => {
      var playerinfo: any = playerinfolist.find(a => a.id == player.playerid);
      var newplayer: any = {};
      newplayer.id = player.playerid;
      newplayer.fullname = playerinfo.fullname;
      newplayer.position = player.sittingposition;
      newplayer.unitbalance = player.creditbalance;
      newplayer.photourl = playerinfo.photourl;
      newplayer.lastactivitytime = playerinfo.lastactivitytime;
      memberlist.push(newplayer);
    });
    newtableinfo.members = [...memberlist];
    resultlist.push(newtableinfo);
  }
  return resultlist;
};
