import { KpashiPlayer } from "../../models/kpashiPlayer";
export async function registerUser(
  userid: string,
  email: string,
  address: string,
  fullname: string,
  phone: string
) {
  var existingrec = await KpashiPlayer.findOne({ email: email });
  if (existingrec != null) throw " Email Address Already Registered";
  var newPlayer = new KpashiPlayer({
    id: userid,
    fullname: fullname,
    email: email,
    address: address,
    phone: phone,
    photourl: ""
  });
  await newPlayer.save();
}
