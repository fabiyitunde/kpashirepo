import { Request, Response } from "express";
import { createUser } from "../commands/registration/createUser";

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
}
