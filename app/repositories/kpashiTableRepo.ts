import * as mongoose from "mongoose";
import { KpashiTable } from "../domain/kpashiTable";
import { KpashiTableInfoSchema } from "../models/kpashiTableInfo";
import { PlayerDetail } from "../domain/playerDetail";
import * as linq from "linq";
const KpashiTableInfo = mongoose.model(
  "KpashiTableInfo",
  KpashiTableInfoSchema
);
export const getKpashiTable = async (tableid: string): Promise<KpashiTable> => {
  var existingrec: any = await KpashiTableInfo.findOne({ tableid: tableid });
  var returnobj = new KpashiTable();
  returnobj.gameisOn = existingrec.gameison;
  returnobj.unitperround = existingrec.unitperround;
  returnobj.id = existingrec.tableid;
  var hostplayer: PlayerDetail = new PlayerDetail();
  hostplayer.playerid = existingrec.hostplayer.playerid;
  hostplayer.playername = existingrec.hostplayer.name;
  returnobj.hostplayer = hostplayer;
  returnobj.description = existingrec.description;
  returnobj.currentGameId = existingrec.currentGameId;
  returnobj.createdon = existingrec.createdon;
  if (existingrec.playerlist) {
    var playerlist: any[] = [];
    existingrec.playerlist.forEach(playerdetail => {
      var newplayerdetail: PlayerDetail = new PlayerDetail();
      newplayerdetail.creditbalance = playerdetail.creditbalance;
      newplayerdetail.playerid = playerdetail.playerid;
      newplayerdetail.playername = playerdetail.name;
      newplayerdetail.sittingposition = playerdetail.sittingposition;
      newplayerdetail.lastactivity = playerdetail.lastactivity;
      newplayerdetail.readytoplay = playerdetail.readytoplay;
      playerlist.push(newplayerdetail);
    });

    returnobj.playerlist = playerlist;
  }
  var playingqueue: { position: number; playerid: string }[] =
    existingrec.playingqueue;
  playingqueue = linq
    .from(playingqueue)
    .orderBy(a => a.position)
    .toArray();
  playingqueue.forEach(playerqueue => {
    returnobj.playingqueue.enqueue(playerqueue.playerid);
  });
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
      newrec.lastactivity = playerinfo.lastactivity;
      newrec.readytoplay = playerinfo.readytoplay;
      playerlist.push(newrec);
    });
  }
  var queuepositioncounter: number = 0;
  var playingqueue: any[] = [];
  while (kpashitable.playingqueue.length > 0) {
    queuepositioncounter += 1;
    var queueplayerid = kpashitable.playingqueue.dequeue();
    playingqueue.push({
      position: queuepositioncounter,
      playerid: queueplayerid
    });
  }

  var newkpashitable: any = {};
  newkpashitable.tableid = kpashitable.id;
  newkpashitable.unitperround = kpashitable.unitperround;
  newkpashitable.gameison = kpashitable.gameisOn;
  newkpashitable.description = kpashitable.description;
  newkpashitable.currentGameId = kpashitable.currentGameId;
  newkpashitable.createdon = kpashitable.createdon;
  newkpashitable.hostplayer = hostplayer;
  newkpashitable.playerlist = playerlist;
  newkpashitable.playingqueue = playingqueue;
  await KpashiTableInfo.findOneAndUpdate(
    { tableid: kpashitable.id },
    newkpashitable,
    { upsert: true }
  );
};
