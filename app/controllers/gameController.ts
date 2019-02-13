import { Request, Response } from "express";
import { startFirstGame } from "../commands/game/startFirstGame";
import { getMyGameDetails } from "../queries/getMyGameDetails";
import { getTableInfo } from "../queries/getTableInfo";
import { shuffleCards } from "../commands/game/shuffleCards";
import { dealCards } from "../commands/game/dealCards";
import { dropCard } from "../commands/game/dropCard";
import { startNewGame } from "../commands/game/startNewGame";
import { iAmReadyToPlay } from "../commands/game/iAmReadyToPlay";
import { getNewGUID } from "../utilities/newGuid";
import { getGameInfo } from "../queries/getGameInfo";
export class GameController {
  public async startFirstGame(req: Request, res: Response) {
    try {
      const { userid, tableid, gameid } = req.body;
      await startFirstGame(userid, tableid, gameid);
      var gameinfo = await getMyGameDetails(userid, gameid);
      res.status(200).json({ success: true, gameinfo: gameinfo });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  public async openGame(req: Request, res: Response) {
    try {
      const { tableid, userid } = req.body;
      const tableinfo: any = await getTableInfo(tableid);
      var gameid = tableinfo.currentGameId;

      if (!tableinfo.currentGameId) {
        gameid = getNewGUID();
        await startFirstGame(userid, tableid, gameid);
      }
      const gameinfo = await getMyGameDetails(userid, gameid);
      const returnobj: any = {
        success: true,
        gameinfo: gameinfo
      };
      res.status(200).json(returnobj);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  public async shuffleCards(req: Request, res: Response) {
    try {
      const { gameid, userid } = req.body;
      await shuffleCards(gameid, userid);
      const gameinfo = await getMyGameDetails(userid, gameid);
      const returnobj: any = {
        success: true,
        gameinfo: gameinfo
      };
      res.status(200).json(returnobj);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  public async dealCards(req: Request, res: Response) {
    try {
      const { gameid, userid } = req.body;
      await dealCards(gameid, userid);
      const gameinfo = await getMyGameDetails(userid, gameid);
      const returnobj: any = {
        success: true,
        gameinfo: gameinfo
      };
      res.status(200).json(returnobj);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  public async dropCard(req: Request, res: Response) {
    try {
      const { gameid, userid, suittype, cardtype } = req.body;
      await dropCard(gameid, userid, suittype, cardtype);
      const gameinfo = await getMyGameDetails(userid, gameid);
      const returnobj: any = {
        success: true,
        gameinfo: gameinfo
      };
      res.status(200).json(returnobj);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  public async startNewGame(req: Request, res: Response) {
    try {
      const { userid, tableid } = req.body;
      const gameid = getNewGUID();
      await startNewGame(userid, tableid, gameid);
      var gameinfo = await getMyGameDetails(userid, gameid);
      res.status(200).json({ success: true, gameinfo: gameinfo });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  public async iAmReadyToPlay(req: Request, res: Response) {
    try {
      const { userid, tableid } = req.body;
      await iAmReadyToPlay(tableid, userid);
      var tableinfo = await getTableInfo(tableid);
      var gameid = tableinfo.currentGameId;
      var gameinfo = await getMyGameDetails(userid, gameid);
      res
        .status(200)
        .json({ success: true, tableinfo: tableinfo, gameinfo: gameinfo });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
