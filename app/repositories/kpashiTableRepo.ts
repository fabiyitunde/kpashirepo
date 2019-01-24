import * as mongoose from "mongoose";
import { KpashiTable } from "../domain/kpashiTable";
import { KpashiTableInfoSchema } from "../models/kpashiTableInfo";
import { PlayerDetail } from "../domain/playerDetail";
const KpashiTableInfo = mongoose.model(
  "KpashiTableInfo",
  KpashiTableInfoSchema
);
export const getKpashiTable = async (tableid: string): Promise<KpashiTable> => {
  var existingrec: any = await KpashiTableInfo.findOne({ tableid: tableid });
  var returnobj = new KpashiTable();
  returnobj.gameisOn = existingrec.gameon;
  returnobj.unitperround = existingrec.unitperround;
  returnobj.id = existingrec.tableid;
  var hostplayer: PlayerDetail = new PlayerDetail();
  hostplayer.playerid = existingrec.hostplayer.playerid;
  hostplayer.playername = existingrec.hostplayer.name;
  returnobj.hostplayer = hostplayer;
  if (existingrec.playerlist) {
    existingrec.playerlist.forEach(playerdetail => {
      var newplayerdetail: PlayerDetail = new PlayerDetail();
      newplayerdetail.creditbalance = playerdetail.creditbalance;
      newplayerdetail.playerid = playerdetail.playerid;
      newplayerdetail.playername = playerdetail.name;
      newplayerdetail.sittingposition = playerdetail.sittingposition;
      returnobj.playerlist.push(newplayerdetail);
    });
  }
  return returnobj;
};

export const saveKpashiTable = async (
  kpashitable: KpashiTable
): Promise<void> => {
  var hostplayer: any = {};
  hostplayer.playerid = kpashitable.hostplayer.playerid;
  hostplayer.name = kpashitable.hostplayer.playername;

  var playerlist: any[] = [];
  if (kpashitable.playerlist) {
    kpashitable.playerlist.forEach(playerinfo => {
      var newrec: any = {};
      newrec.playerid = playerinfo.playerid;
      newrec.name = playerinfo.playername;
      newrec.sittingposition = playerinfo.sittingposition;
      newrec.creditbalance = playerinfo.creditbalance;
      playerlist.push(newrec);
    });
  }
  var newkpashitable: any = {};
  newkpashitable.tableid = kpashitable.id;
  newkpashitable.unitperround = kpashitable.unitperround;
  newkpashitable.gameison = kpashitable.gameisOn;
  newkpashitable.hostplayer = hostplayer;
  newkpashitable.playerlist = playerlist;
  await KpashiTableInfo.findOneAndUpdate(
    { tableid: kpashitable.id },
    newkpashitable,
    { upsert: true }
  );
};
