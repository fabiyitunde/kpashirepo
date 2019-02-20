import * as mongoose from "mongoose";
import { KpashiPlayer } from "../../models/kpashiPlayer";
import { KpashiTable } from "../../domain/kpashiTable";
import { saveKpashiTable } from "../../repositories/kpashiTableRepo";
import { getNewGUID } from "../../utilities/newGuid";
export class createUser {
  payload: any = {};
  isOk: boolean = false;
  errormsg: string = "";
  async createUser(
    userid: string,
    email: string,
    address: string,
    fullname: string,
    phone: string,
    photourl: string
  ) {
    try {
      var existingrec = await KpashiPlayer.findOne({ email: email });
      if (existingrec == undefined || existingrec == null) {
        var newPlayer = new KpashiPlayer({
          id: userid,
          fullname: fullname,
          email: email,
          address: address,
          phone: phone,
          photourl: photourl
        });
        this.payload = await newPlayer.save();
        var newtable: KpashiTable = new KpashiTable();
        var tableid = getNewGUID();
        var tablename = fullname + " kpashi Table";
        newtable.create(tableid, userid, fullname, 2, 10, tablename);
        await saveKpashiTable(newtable);
      } else {
        this.payload = await KpashiPlayer.findOneAndUpdate(
          { id: userid },
          {
            fullname: fullname,
            email: email,
            address: address,
            phone: phone,
            photourl: photourl
          }
        );
      }

      this.isOk = true;
    } catch (error) {
      this.isOk = false;
      this.errormsg = error;
    }
  }
}
