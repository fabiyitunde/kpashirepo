import * as mongoose from "mongoose";
import { KpashiTableInfoSchema } from "../models/kpashiTableInfo";
import { KpashiPlayer } from "../models/kpashiPlayer";

const KpashiTableInfo = mongoose.model(
  "KpashiTableInfo",
  KpashiTableInfoSchema
);

export const getTableInfo = async tableid => {
  var newtableinfo: any = {};
  var tableinfo: any = await KpashiTableInfo.findOne({ tableid: tableid });
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
  return newtableinfo;
};
