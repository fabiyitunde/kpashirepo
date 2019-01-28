import * as mongoose from "mongoose";
import { KpashiPlayer } from "../models/kpashiPlayer";

export const getAllUsersList = async () => {
  var userlist: any[] = await KpashiPlayer.find({});
  var returnlist: any[] = [];
  userlist.forEach(user => {
    var player: any = {};
    player.id = user.id;
    player.address = user.address;
    player.email = user.email;
    player.fullname = user.fullname;
    player.phone = user.phone;
    player.photourl = user.photourl;
    player.registrationDate = user.registrationDate;
    returnlist.push(player);
  });
  return returnlist;
};
