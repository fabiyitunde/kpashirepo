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
const startFirstGame_1 = require("../commands/game/startFirstGame");
const getMyGameDetails_1 = require("../queries/getMyGameDetails");
const getTableInfo_1 = require("../queries/getTableInfo");
const shuffleCards_1 = require("../commands/game/shuffleCards");
const dealCards_1 = require("../commands/game/dealCards");
const dropCard_1 = require("../commands/game/dropCard");
const startNewGame_1 = require("../commands/game/startNewGame");
const iAmReadyToPlay_1 = require("../commands/game/iAmReadyToPlay");
const newGuid_1 = require("../utilities/newGuid");
const cancelCurrentGame_1 = require("../commands/game/cancelCurrentGame");
class GameController {
    startFirstGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userid, tableid, gameid } = req.body;
                yield startFirstGame_1.startFirstGame(userid, tableid, gameid);
                var gameinfo = yield getMyGameDetails_1.getMyGameDetails(userid, gameid);
                res.status(200).json({ success: true, gameinfo: gameinfo });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    openGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tableid, userid } = req.body;
                const tableinfo = yield getTableInfo_1.getTableInfo(tableid);
                var gameid = tableinfo.currentGameId;
                if (!tableinfo.currentGameId) {
                    gameid = newGuid_1.getNewGUID();
                    yield startFirstGame_1.startFirstGame(userid, tableid, gameid);
                }
                const gameinfo = yield getMyGameDetails_1.getMyGameDetails(userid, gameid);
                const returnobj = {
                    success: true,
                    gameinfo: gameinfo
                };
                res.status(200).json(returnobj);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    shuffleCards(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gameid, userid } = req.body;
                yield shuffleCards_1.shuffleCards(gameid, userid);
                const gameinfo = yield getMyGameDetails_1.getMyGameDetails(userid, gameid);
                const returnobj = {
                    success: true,
                    gameinfo: gameinfo
                };
                res.status(200).json(returnobj);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    dealCards(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gameid, userid } = req.body;
                yield dealCards_1.dealCards(gameid, userid);
                const gameinfo = yield getMyGameDetails_1.getMyGameDetails(userid, gameid);
                const returnobj = {
                    success: true,
                    gameinfo: gameinfo
                };
                res.status(200).json(returnobj);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    dropCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gameid, userid, suittype, cardtype } = req.body;
                yield dropCard_1.dropCard(gameid, userid, suittype, cardtype);
                const gameinfo = yield getMyGameDetails_1.getMyGameDetails(userid, gameid);
                const tableinfo = yield getTableInfo_1.getTableInfo(gameinfo.tableid);
                const returnobj = {
                    success: true,
                    gameinfo: gameinfo,
                    tableinfo: tableinfo
                };
                res.status(200).json(returnobj);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    startNewGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userid, tableid } = req.body;
                const gameid = newGuid_1.getNewGUID();
                yield startNewGame_1.startNewGame(userid, tableid, gameid);
                var gameinfo = yield getMyGameDetails_1.getMyGameDetails(userid, gameid);
                res.status(200).json({ success: true, gameinfo: gameinfo });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    iAmReadyToPlay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userid, tableid } = req.body;
                yield iAmReadyToPlay_1.iAmReadyToPlay(tableid, userid);
                var tableinfo = yield getTableInfo_1.getTableInfo(tableid);
                var gameid = tableinfo.currentGameId;
                var gameinfo = yield getMyGameDetails_1.getMyGameDetails(userid, gameid);
                res
                    .status(200)
                    .json({ success: true, tableinfo: tableinfo, gameinfo: gameinfo });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    cancelCurrentGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userid, tableid } = req.body;
                yield cancelCurrentGame_1.cancelCurrentGame(tableid, userid);
                var tableinfo = yield getTableInfo_1.getTableInfo(tableid);
                var gameid = tableinfo.currentGameId;
                var gameinfo = yield getMyGameDetails_1.getMyGameDetails(userid, gameid);
                res
                    .status(200)
                    .json({ success: true, tableinfo: tableinfo, gameinfo: gameinfo });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
}
exports.GameController = GameController;
//# sourceMappingURL=gameController.js.map