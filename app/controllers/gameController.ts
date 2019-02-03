import { Request, Response } from "express";
import { startFirstGame } from "../commands/game/startFirstGame";
import { getMyGameDetails } from "../queries/getMyGameDetails";
import { getTableInfo } from "../queries/getTableInfo";
import { shuffleCards } from "../commands/game/shuffleCards";
import { dealCards } from "../commands/game/dealCards";
import { dropCard } from "../commands/game/dropCard";
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
      if (!tableinfo.currentGameId) throw "No Current Game";
      const gameinfo = await getMyGameDetails(userid, tableinfo.currentGameId);
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
}
