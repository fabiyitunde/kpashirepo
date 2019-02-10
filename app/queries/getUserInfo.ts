import * as mongoose from "mongoose";
import { KpashiPlayer } from "../models/kpashiPlayer";

export const getUserInfo = async userid => {
  var userinfo = await KpashiPlayer.findOne({ id: userid });

  return userinfo;
};

export const getUserInfoByEmail = async email => {
  var userinfo = await KpashiPlayer.findOne({ email: email });

  return userinfo;
};
