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
}
exports.RegistrationController = RegistrationController;
//# sourceMappingURL=registrationController.js.map