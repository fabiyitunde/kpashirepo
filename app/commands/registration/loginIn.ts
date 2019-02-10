import { KpashiPlayer } from "../../models/kpashiPlayer";
export async function logIn(email: string, password: string) {
  var existingrec = await KpashiPlayer.findOne({ email: email });
  if (existingrec == null || existingrec == undefined)
    throw "Invalid Email Address";

  if (password != "kpashi") throw "invalid password";
}
