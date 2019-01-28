import * as postal from "postal";
import * as datetime from "node-datetime";
import uuid from "uuid/v5";
import uniqid from "uniqid";
import {
  postalChannels,
  postalTopics,
  clientSideHandlerAddresses
} from "../param";
import * as http from "http";
import * as socketio from "socket.io";
export class clientSocketHandler {
  constructor(app) {
    let server = http.createServer(app);
    let io = socketio(server);

    const channel = postal.channel(postalChannels.kpashiChannel);
    channel.subscribe(postalTopics.tableInvitation, eventobj =>
      this.sendTableInvite(eventobj, io)
    );
    channel.subscribe(postalTopics.tableInvitationAcceptance, eventobj =>
      this.sendTableInvitationAcceptance(eventobj, io)
    );
  }
  sendTableInvite(eventobj, io) {
    var { tableinfo, hostuserinfo, guestuserinfo } = eventobj;
    var returnobj: any = {};
    returnobj.payload = tableinfo;
    returnobj.address = clientSideHandlerAddresses.tableinvite;
    returnobj.source = hostuserinfo;
    returnobj.description = "Table Invitation Needs Your Attention";
    returnobj.time = new Date(datetime.now()).toString();
    returnobj.id = uuid(uniqid(), uuid.DNS);
    var eventname = "evt" + guestuserinfo.id;
    io.emit(eventname, returnobj);
  }
  sendTableInvitationAcceptance(eventobj, io) {
    var { tableinfo, userinfo } = eventobj;
    var members: any[] = tableinfo.members;
    members.forEach(player => {
      var returnobj: any = {};
      returnobj.payload = tableinfo;
      returnobj.address = clientSideHandlerAddresses.tableinviteResponse;
      returnobj.source = userinfo;
      returnobj.description = userinfo.fullname + " just joined the Table";
      returnobj.time = new Date(datetime.now()).toString();
      returnobj.id = uuid(uniqid(), uuid.DNS);
      var eventname = "evt" + player.id;
      io.emit(eventname, returnobj);
    });
  }
}
