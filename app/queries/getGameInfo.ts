import * as mongoose from "mongoose";
import { KpashiPlayer } from "../models/kpashiPlayer";
import { KpashiGameInfoSchema } from "../models/kpashiGameInfo";
const KpashiGameInfo = mongoose.model("KpashiGameInfo", KpashiGameInfoSchema);
export const getGameInfo = async gameid => {
  var gameinfo = await KpashiGameInfo.findOne({ id: gameid });
  return gameinfo;
};
