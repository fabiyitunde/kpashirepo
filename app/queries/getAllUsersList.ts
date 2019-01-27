import * as mongoose from "mongoose";
import { KpashiPlayer } from "../models/kpashiPlayer";

export const getAllUsersList = async () => {
  var userlist = await KpashiPlayer.find({});
  return userlist;
};
