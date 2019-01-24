"use strict";
exports.__esModule = true;
var registrationController_1 = require("../controllers/registrationController");
var registrationRoutes = /** @class */ (function () {
    function registrationRoutes() {
        this.registrationController = new registrationController_1.RegistrationController();
    }
    registrationRoutes.prototype.routes = function (app) {
        app
            .route("/registration/create")
            .post(this.registrationController.createuser);
    };
    return registrationRoutes;
}());
exports.registrationRoutes = registrationRoutes;
