import { Request, Response } from "express";
import { createUser } from "../commands/registration/createUser";
import { createMyTable } from "../commands/registration/createMyTable";
import { getMyTableList } from "../queries/getMyTableList";
import { getAllUsersList } from "../queries/getAllUsersList";
import { sendTableInvite } from "./../commands/registration/sendTableInvite";
import { joinTable } from "commands/registration/joinTable";

export class RegistrationController {
  public async createuser(req: Request, res: Response) {
    let cmd = new createUser();
    const { userid, address, email, fullname, phone, photourl } = req.body;
    await cmd.createUser(userid, email, address, fullname, phone, photourl);
    if (cmd.isOk) {
      res.status(200).json(cmd.payload);
    } else {
      res.status(400).send(cmd.errormsg);
    }
  }
  public async createTable(req: Request, res: Response) {
    try {
      const {
        userid,
        tableid,
        description,
        unitperhand,
        credittoken
      } = req.body;
      let cmd = new createMyTable(
        userid,
        description,
        unitperhand,
        credittoken,
        tableid
      );
      await cmd.process();
      var mytablelist = await getMyTableList(userid);
      res.status(200).json(mytablelist);
    } catch (error) {
      res.status(400).send(error);
    }
  }
  public async sendTableInvite(req: Request, res: Response) {
    try {
      const { hostuserid, guestuserid, tableid } = req.body;
      let cmd = new sendTableInvite(hostuserid, guestuserid, tableid);
      await cmd.process();
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).send(error);
    }
  }
  public async joinTable(req: Request, res: Response) {
    try {
      const { userid, credittoken, tableid } = req.body;
      let cmd = new joinTable(userid, tableid, credittoken);
      await cmd.process();
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).send(error);
    }
  }
  public async getMyTableList(req: Request, res: Response) {
    try {
      const { tableid } = req.params;
      const resultlist = await getMyTableList(tableid);
      res.status(200).json(resultlist);
    } catch (error) {
      res.status(400).send(error);
    }
  }
  public async getAllUsersList(req: Request, res: Response) {
    try {
      const resultlist = await getAllUsersList();
      res.status(200).json(resultlist);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
