import * as mongoose from "mongoose";
import { KpashiTableInfoSchema } from "../models/kpashiTableInfo";
import { KpashiPlayer } from "../models/kpashiPlayer";

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
  tablelist.forEach(tableinfo => {
    var newtableinfo: any = {};
    newtableinfo.id = tableinfo.tableid;
    newtableinfo.description = tableinfo.description;
    newtableinfo.hostname = tableinfo.hostplayer.name;
    newtableinfo.hostplayerid = tableinfo.hostplayer.playerid;
    newtableinfo.oneroundunit = tableinfo.unitperround;
    newtableinfo.currentGameId = tableinfo.tableid;
    newtableinfo.isOn = tableinfo.gameison;
    newtableinfo.createOn = tableinfo.tableid;
    var playerlist: any[] = tableinfo.playerlist;
    newtableinfo.membercount = playerlist.length;
    var memberlist: any[] = [];
    playerlist.forEach(async player => {
      var playerinfo: any = await KpashiPlayer.findOne({ id: player.playerid });
      var newplayer: any = {};
      newplayer.id = player.playerid;
      newplayer.fullname = playerinfo.fullname;
      newplayer.position = player.sittingposition;
      newplayer.unitbalance = player.creditbalance;
      newplayer.photourl = playerinfo.photourl;
      newplayer.lastactivitytime = playerinfo.lastactivitytime;
      memberlist.push(newplayer);
    });
    newtableinfo.members = memberlist;
    resultlist.push(newtableinfo);
  });
  return resultlist;
};
