//var admin = require("firebase-admin");
import * as admin from 'firebase-admin';
//var serviceAccount = require("serviceAccountKey.json");
import {BalanceSheet } from "./agasresponses/BalanceSheet"

import { AGASRequestInfo } from "./agas.model";
import { agas } from "./agas";
//import { InstanceLoader } from "./agas.model"
import { AGASResponseFactory } from "./agasresponses/AGASResponseFactory"

//// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert("serviceAccountKey.json"),
    databaseURL: "https://giftler-24670.firebaseio.com"
});
//console.log("Started Please next");
//// As an admin, the app has access to read and write all data, regardless of Security Rules
//var db = admin.database();
//db.ref().off();

 var agasresponse = new AGASResponseFactory();
 agasresponse.processRequest();


// console.log("Call back removed");
// var ags = new agas();
// var queryresult = ags.getCOASegmentTypeList().then(res => {
//     var ref = db.ref("COASegmentType");
//     ref.set(res);
//     console.log(res);
// }).then(() => {
//     return ags.getGPFSNoteTypeList();
// }).then(res => {
//     var ref = db.ref("GPFSNoteType");
//     ref.set(res);
//     console.log(res);
// }).then(() => {
//     return ags.getdto_alertprocessorinfoList();
// }).then(res => {
//     var ref = db.ref("AGASAlertType");
//     ref.set(res);
//     console.log(res);
// });


