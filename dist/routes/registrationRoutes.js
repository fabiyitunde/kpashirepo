"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registrationController_1 = require("../controllers/registrationController");
class registrationRoutes {
    constructor() {
        this.registrationController = new registrationController_1.RegistrationController();
    }
    routes(app) {
        app
            .route("/registration/createuser")
            .post(this.registrationController.createuser);
        app
            .route("/registration/createTable")
            .post(this.registrationController.createTable);
        app
            .route("/registration/sendTableInvite")
            .post(this.registrationController.sendTableInvite);
        app
            .route("/registration/joinTable")
            .post(this.registrationController.joinTable);
        app
            .route("/registration/topUpCredit")
            .post(this.registrationController.topUpCredit);
        app
            .route("/registration/getMyTableList/:userid")
            .get(this.registrationController.getMyTableList);
        app
            .route("/registration/getAllUsersList")
            .get(this.registrationController.getAllUsersList);
    }
}
exports.registrationRoutes = registrationRoutes;
//# sourceMappingURL=registrationRoutes.js.map