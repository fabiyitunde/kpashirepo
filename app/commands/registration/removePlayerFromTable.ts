import { KpashiPlayer } from "../../models/kpashiPlayer";
import { KpashiTable } from "../../domain/kpashiTable";
import { getUserInfo } from "../../queries/getUserInfo";
import { getTableInfo } from "../../queries/getTableInfo";
import { raisePlayerRemovedFromTableEvent } from "../../domainevents/tableEvents";
import {
  getKpashiTable,
  saveKpashiTable
} from "../../repositories/kpashiTableRepo";
export async function removePlayerFromTable(
  playerToRemoveId: string,
  hostPlayerId: string,
  tableid: string
) {
  var playerinfo: any = await KpashiPlayer.findOne({ id: playerToRemoveId });
  var table: KpashiTable = await getKpashiTable(tableid);
  table.removePlayerFromTable(playerToRemoveId, hostPlayerId, balance => {
    if (playerinfo.availablecredit) {
      playerinfo.availablecredit += balance;
    } else {
      playerinfo.availablecredit = balance;
    }
  });
  await saveKpashiTable(table);
  await KpashiPlayer.findOneAndUpdate({ id: playerToRemoveId }, playerinfo);
  const hostplayerinfo = await getUserInfo(hostPlayerId);
  const playertoremoveinfo = await getUserInfo(playerToRemoveId);
  const tableinfo = await getTableInfo(tableid);
  raisePlayerRemovedFromTableEvent(
    tableinfo,
    hostplayerinfo,
    playertoremoveinfo
  );
}
