"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postal = require("postal");
const datetime = require("node-datetime");
const v5_1 = require("uuid/v5");
const uniqid_1 = require("uniqid");
const param_1 = require("../param");
const http = require("http");
const socketio = require("socket.io");
class clientSocketHandler {
    constructor(app) {
        let server = http.createServer(app);
        let io = socketio(server);
        const channel = postal.channel(param_1.postalChannels.kpashiChannel);
        channel.subscribe(param_1.postalTopics.tableInvitation, eventobj => this.sendTableInvite(eventobj, io));
        channel.subscribe(param_1.postalTopics.tableInvitationAcceptance, eventobj => this.sendTableInvitationAcceptance(eventobj, io));
    }
    sendTableInvite(eventobj, io) {
        var { tableinfo, hostuserinfo, guestuserinfo } = eventobj;
        var returnobj = {};
        returnobj.payload = tableinfo;
        returnobj.address = param_1.clientSideHandlerAddresses.tableinvite;
        returnobj.source = hostuserinfo;
        returnobj.description = "Table Invitation Needs Your Attention";
        returnobj.time = new Date(datetime.now()).toString();
        returnobj.id = v5_1.default(uniqid_1.default(), v5_1.default.DNS);
        var eventname = "evt" + guestuserinfo.id;
        io.emit(eventname, returnobj);
    }
    sendTableInvitationAcceptance(eventobj, io) {
        var { tableinfo, userinfo } = eventobj;
        var members = tableinfo.members;
        members.forEach(player => {
            var returnobj = {};
            returnobj.payload = tableinfo;
            returnobj.address = param_1.clientSideHandlerAddresses.tableinviteResponse;
            returnobj.source = userinfo;
            returnobj.description = userinfo.fullname + " just joined the Table";
            returnobj.time = new Date(datetime.now()).toString();
            returnobj.id = v5_1.default(uniqid_1.default(), v5_1.default.DNS);
            var eventname = "evt" + player.id;
            io.emit(eventname, returnobj);
        });
    }
}
exports.clientSocketHandler = clientSocketHandler;
//# sourceMappingURL=clientSocketHandler.js.map