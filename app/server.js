"use strict";
exports.__esModule = true;
var app_1 = require("./app");
var PORT = 3000;
app_1["default"].listen(PORT, function () {
    console.log("Express server listening on port " + PORT);
});
