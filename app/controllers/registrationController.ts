import { Request, Response } from "express";
import { createUser } from "../commands/registration/createUser";
import { createMyTable } from "../commands/registration/createMyTable";
import { getMyTableList } from "../queries/getMyTableList";
import { getAllUsersList } from "../queries/getAllUsersList";
import { getTableInfo } from "../queries/getTableInfo";
import { sendTableInvite } from "../commands/registration/sendTableInvite";
import { joinTable } from "../commands/registration/joinTable";
import { topUpCredit } from "../commands/registration/topUpCredit";
import { logIn } from "../commands/registration/loginIn";
import { registerUser } from "../commands/registration/registerUser";
import { getUserInfoByEmail, getUserInfo } from "../queries/getUserInfo";
import { registerUserForNotifications } from "../utilities/pushNotificationsProvider";
import { removePlayerFromTable } from "../commands/registration/removePlayerFromTable";
import { getOnlineUsers } from "../queries/getOnlineUsers";
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
        oneroundunit,
        credittoken
      } = req.body;
      let cmd = new createMyTable(
        userid,
        description,
        oneroundunit,
        credittoken,
        tableid
      );
      await cmd.process();
      var mytablelist = await getMyTableList(userid);
      var returnobj: any = {
        mytablelist: mytablelist,
        success: true,
        id: tableid
      };
      res.status(200).json(returnobj);
    } catch (error) {
      console.log("error", error);
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
      var tableinfo = await getTableInfo(tableid);
      res.status(200).json({ success: true, tableinfo: tableinfo });
    } catch (error) {
      console.log("It was an error", error);
      res.status(400).send(error);
    }
  }
  public async topUpCredit(req: Request, res: Response) {
    try {
      const { userid, credittoken, tableid } = req.body;
      let cmd = new topUpCredit(userid, tableid, credittoken);
      await cmd.process();
      var tableinfo = await getTableInfo(tableid);
      res.status(200).json({ success: true, tableinfo: tableinfo });
    } catch (error) {
      console.log("Error Detected", error);
      res.status(400).send(error);
    }
  }
  public async getMyTableList(req: Request, res: Response) {
    try {
      const { userid } = req.params;
      const resultlist = await getMyTableList(userid);
      const allusers = await getAllUsersList();
      const playerinfo = await getUserInfo(userid);
      const returnobj: any = {
        success: true,
        mytablelist: resultlist,
        playerlist: allusers,
        playerinfo: playerinfo
      };
      res.status(200).json(returnobj);
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
  public async logIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      await logIn(email, password);
      var userinfo = await getUserInfoByEmail(email);
      const resultlist = await getMyTableList(userinfo.id);
      const allusers = await getAllUsersList();
      res.status(200).json({
        success: true,
        userinfo: userinfo,
        mytablelist: resultlist,
        playerlist: allusers
      });
    } catch (error) {
      console.log("Error Detected", error);
      res.status(400).send(error);
    }
  }
  public async registerUser(req: Request, res: Response) {
    try {
      const { userid, address, email, fullname, phone } = req.body;
      await registerUser(userid, email, address, fullname, phone);
      var userinfo = await getUserInfoByEmail(email);
      res.status(200).json({ success: true, userinfo: userinfo });
    } catch (error) {
      console.log("Error Detected", error);
      res.status(400).send(error);
    }
  }
  public async registerNotificationToken(req: Request, res: Response) {
    try {
      const { userid, tokenid } = req.body;
      await registerUserForNotifications(userid, tokenid);

      res.status(200).json({ success: true });
    } catch (error) {
      console.log("Error Detected", error);
      res.status(400).send(error);
    }
  }
  public async removePlayerFromTable(req: Request, res: Response) {
    try {
      const { playertoremoveId, hostplayerid, tableid } = req.body;
      await removePlayerFromTable(playertoremoveId, hostplayerid, tableid);
      var tableinfo = await getTableInfo(tableid);
      var hostplayerinfo = await getUserInfo(hostplayerid);
      var removeplayerinfo = await getUserInfo(playertoremoveId);

      res.status(200).json({
        success: true,
        tableinfo: tableinfo,
        hostplayerinfo: hostplayerinfo,
        removeplayerinfo: removeplayerinfo
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  public async getOnlineUsers(req: Request, res: Response) {
    try {
      const playerlist = await getOnlineUsers();

      res.status(200).json(playerlist);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
