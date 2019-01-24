"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registrationController_1 = require("../controllers/registrationController");
class registrationRoutes {
    constructor() {
        this.registrationController = new registrationController_1.RegistrationController();
    }
    routes(app) {
        app
            .route("/registration/create")
            .post(this.registrationController.createuser);
    }
}
exports.registrationRoutes = registrationRoutes;
//# sourceMappingURL=registrationRoutes.js.map