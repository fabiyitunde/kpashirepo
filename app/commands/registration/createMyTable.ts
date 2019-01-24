import { KpashiPlayer } from "../../models/kpashiPlayer";
export async function createMyTable(
  userid: string,
  description: string,
  unitperhand: number,
  credittoken: string
) {
  var hostplayerinfo = await KpashiPlayer.findOne({ id: userid });
}
