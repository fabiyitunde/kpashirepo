"use strict";
var admin = require('firebase-admin');
var AGASResponseFactory_1 = require("./agasresponses/AGASResponseFactory");
admin.initializeApp({
    credential: admin.credential.cert("serviceAccountKey.json"),
    databaseURL: "https://kpashi-2bc65.firebaseio.com/"
});
var agasresponse = new AGASResponseFactory_1.AGASResponseFactory();
agasresponse.processRequest();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBWSxLQUFLLFdBQU0sZ0JBQWdCLENBQUMsQ0FBQTtBQU94QyxvQ0FBb0MscUNBR3BDLENBQUMsQ0FId0U7QUFHekUsS0FBSyxDQUFDLGFBQWEsQ0FBQztJQUNoQixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUM7SUFDM0QsV0FBVyxFQUFFLHNDQUFzQztDQUN0RCxDQUFDLENBQUM7QUFNRixJQUFJLFlBQVksR0FBRyxJQUFJLHlDQUFtQixFQUFFLENBQUM7QUFDN0MsWUFBWSxDQUFDLGNBQWMsRUFBRSxDQUFDIn0=