import { KpashiPlayer } from "../../models/kpashiPlayer";
import { validateToken } from "../../utilities/tokenvalidatorprovider";
import { KpashiTable } from "../../domain/kpashiTable";
import { saveKpashiTable } from "../../repositories/kpashiTableRepo";
export class createMyTable {
  tableid: string;
  userid: string;
  description: string;
  unitperhand: number;
  credittoken: string;

  constructor(
    userid: string,
    description: string,
    unitperhand: number,
    credittoken: string,
    tableid: string
  ) {
    this.userid = userid;
    this.description = description;
    this.unitperhand = unitperhand;
    this.credittoken = credittoken;
    this.tableid = tableid;
  }
  async process() {
    var newtable: KpashiTable = new KpashiTable();
    var unitvalue: number = validateToken(this.credittoken);
    var playerdetail: any = await KpashiPlayer.findOne({ id: this.userid });
    newtable.create(
      this.tableid,
      this.userid,
      playerdetail.fullname,
      this.unitperhand,
      unitvalue,
      this.description
    );
    await saveKpashiTable(newtable);
  }
}
