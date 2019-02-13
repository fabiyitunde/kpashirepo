import uniqid from "uniqid";
import uuid from "uuid/v5";

export const getNewGUID = () => {
  const uniqueid = uniqid();
  const newguid = uuid(uniqueid, uuid.DNS);
  return newguid;
};
