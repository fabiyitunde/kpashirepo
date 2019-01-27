import { KpashiTable } from "../../domain/kpashiTable";
import { getKpashiTable } from "../../repositories/kpashiTableRepo";
import { getTableInfo } from "../../queries/getTableInfo";
import { getUserInfo } from "../../queries/getUserInfo";
import * as postal from "postal";
import * as datetime from "node-datetime";
import uuid from "uuid/v5";
import uniqid from "uniqid";
import { postalChannels, postalTopics } from "../../param";
export class sendTableInvite {
  hostuserid: string;
  guestuserid: string;
  tableid: string;
  constructor(hostuserid: string, guestuserid: string, tableid: string) {
    this.guestuserid = guestuserid;
    this.hostuserid = hostuserid;
    this.tableid = tableid;
  }
  async process() {
    var kpashitable = await getKpashiTable(this.tableid);
    if (kpashitable.gameisOn)
      throw "Player Addition Not Allowed In The Middle Of A Game";

    if (kpashitable.playerAlreadyExist(this.guestuserid))
      throw "Player Already In Group";
    var eventobj: any = {};
    eventobj.tableinfo = await getTableInfo(this.tableid);
    eventobj.hostuserinfo = await getUserInfo(this.hostuserid);
    eventobj.guestuserinfo = await getUserInfo(this.guestuserid);
    const channel = postal.channel(postalChannels.kpashiChannel);
    channel.publish(postalTopics.tableInvitation, eventobj);
  }
}
