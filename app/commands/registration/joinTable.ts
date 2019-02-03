import {
  getKpashiTable,
  saveKpashiTable
} from "../../repositories/kpashiTableRepo";
import { validateToken } from "../../utilities/tokenvalidatorprovider";
import { getUserInfo } from "../../queries/getUserInfo";
import { getTableInfo } from "../../queries/getTableInfo";
import { postalChannels, postalTopics } from "../../param";
import * as postal from "postal";
export class joinTable {
  userid: string;
  tableid: string;
  credittoken: string;
  constructor(userid: string, tableid: string, credittoken: string) {
    this.userid = userid;
    this.tableid = tableid;
    this.credittoken = credittoken;
  }
  async process() {
    var kpashitable = await getKpashiTable(this.tableid);
    var unitvalue: number = validateToken(this.credittoken);
    var userinfo: any = await getUserInfo(this.userid);
    kpashitable.addplayer(this.userid, userinfo.fullname, unitvalue);
    await saveKpashiTable(kpashitable);
    var eventobj: any = {};
    eventobj.tableinfo = await getTableInfo(this.tableid);
    eventobj.userinfo = userinfo;
    const channel = postal.channel(postalChannels.kpashiChannel);
    channel.publish(postalTopics.tableInvitationAcceptance, eventobj);
  }
}
