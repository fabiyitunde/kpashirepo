import * as mongoose from "mongoose";
import { KpashiTableInfoSchema } from "../models/kpashiTableInfo";
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
    newtableinfo.id = tableinfo.tableid;
    resultlist.push(newtableinfo);
  });
  return resultlist;
};
