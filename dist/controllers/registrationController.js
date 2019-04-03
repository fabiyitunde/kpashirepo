"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const createUser_1 = require("../commands/registration/createUser");
const createMyTable_1 = require("../commands/registration/createMyTable");
const getMyTableList_1 = require("../queries/getMyTableList");
const getAllUsersList_1 = require("../queries/getAllUsersList");
const getTableInfo_1 = require("../queries/getTableInfo");
const sendTableInvite_1 = require("../commands/registration/sendTableInvite");
const joinTable_1 = require("../commands/registration/joinTable");
const topUpCredit_1 = require("../commands/registration/topUpCredit");
const loginIn_1 = require("../commands/registration/loginIn");
const registerUser_1 = require("../commands/registration/registerUser");
const getUserInfo_1 = require("../queries/getUserInfo");
const pushNotificationsProvider_1 = require("../utilities/pushNotificationsProvider");
const removePlayerFromTable_1 = require("../commands/registration/removePlayerFromTable");
const getOnlineUsers_1 = require("../queries/getOnlineUsers");
class RegistrationController {
    createuser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let cmd = new createUser_1.createUser();
            const { userid, address, email, fullname, phone, photourl } = req.body;
            yield cmd.createUser(userid, email, address, fullname, phone, photourl);
            if (cmd.isOk) {
                res.status(200).json(cmd.payload);
            }
            else {
                res.status(400).send(cmd.errormsg);
            }
        });
    }
    createTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userid, tableid, description, oneroundunit, credittoken } = req.body;
                let cmd = new createMyTable_1.createMyTable(userid, description, oneroundunit, credittoken, tableid);
                yield cmd.process();
                var mytablelist = yield getMyTableList_1.getMyTableList(userid);
                var returnobj = {
                    mytablelist: mytablelist,
                    success: true,
                    id: tableid
                };
                res.status(200).json(returnobj);
            }
            catch (error) {
                console.log("error", error);
                res.status(400).send(error);
            }
        });
    }
    sendTableInvite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hostuserid, guestuserid, tableid } = req.body;
                let cmd = new sendTableInvite_1.sendTableInvite(hostuserid, guestuserid, tableid);
                yield cmd.process();
                res.status(200).json({ success: true });
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    joinTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userid, credittoken, tableid } = req.body;
                let cmd = new joinTable_1.joinTable(userid, tableid, credittoken);
                yield cmd.process();
                var tableinfo = yield getTableInfo_1.getTableInfo(tableid);
                res.status(200).json({ success: true, tableinfo: tableinfo });
            }
            catch (error) {
                console.log("It was an error", error);
                res.status(400).send(error);
            }
        });
    }
    topUpCredit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userid, credittoken, tableid } = req.body;
                let cmd = new topUpCredit_1.topUpCredit(userid, tableid, credittoken);
                yield cmd.process();
                var tableinfo = yield getTableInfo_1.getTableInfo(tableid);
                res.status(200).json({ success: true, tableinfo: tableinfo });
            }
            catch (error) {
                console.log("Error Detected", error);
                res.status(400).send(error);
            }
        });
    }
    getMyTableList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userid } = req.params;
                const resultlist = yield getMyTableList_1.getMyTableList(userid);
                const allusers = yield getAllUsersList_1.getAllUsersList();
                const playerinfo = yield getUserInfo_1.getUserInfo(userid);
                const returnobj = {
                    success: true,
                    mytablelist: resultlist,
                    playerlist: allusers,
                    playerinfo: playerinfo
                };
                res.status(200).json(returnobj);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    getAllUsersList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultlist = yield getAllUsersList_1.getAllUsersList();
                res.status(200).json(resultlist);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    logIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                yield loginIn_1.logIn(email, password);
                var userinfo = yield getUserInfo_1.getUserInfoByEmail(email);
                const resultlist = yield getMyTableList_1.getMyTableList(userinfo.id);
                const allusers = yield getAllUsersList_1.getAllUsersList();
                res.status(200).json({
                    success: true,
                    userinfo: userinfo,
                    mytablelist: resultlist,
                    playerlist: allusers
                });
            }
            catch (error) {
                console.log("Error Detected", error);
                res.status(400).send(error);
            }
        });
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userid, address, email, fullname, phone } = req.body;
                yield registerUser_1.registerUser(userid, email, address, fullname, phone);
                var userinfo = yield getUserInfo_1.getUserInfoByEmail(email);
                res.status(200).json({ success: true, userinfo: userinfo });
            }
            catch (error) {
                console.log("Error Detected", error);
                res.status(400).send(error);
            }
        });
    }
    registerNotificationToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userid, tokenid } = req.body;
                yield pushNotificationsProvider_1.registerUserForNotifications(userid, tokenid);
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.log("Error Detected", error);
                res.status(400).send(error);
            }
        });
    }
    removePlayerFromTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { playertoremoveId, hostplayerid, tableid } = req.body;
                yield removePlayerFromTable_1.removePlayerFromTable(playertoremoveId, hostplayerid, tableid);
                var tableinfo = yield getTableInfo_1.getTableInfo(tableid);
                var hostplayerinfo = yield getUserInfo_1.getUserInfo(hostplayerid);
                var removeplayerinfo = yield getUserInfo_1.getUserInfo(playertoremoveId);
                res.status(200).json({
                    success: true,
                    tableinfo: tableinfo,
                    hostplayerinfo: hostplayerinfo,
                    removeplayerinfo: removeplayerinfo
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getOnlineUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const playerlist = yield getOnlineUsers_1.getOnlineUsers();
                res.status(200).json(playerlist);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
}
exports.RegistrationController = RegistrationController;
//# sourceMappingURL=registrationController.js.map