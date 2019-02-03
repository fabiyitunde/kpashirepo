"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameController_1 = require("../controllers/gameController");
exports.registerGameRoutes = app => {
    var gameController = new gameController_1.GameController();
    app.route("/game/startFirstGame").post(gameController.startFirstGame);
    app.route("/game/openGame").post(gameController.openGame);
    app.route("/game/shuffleCards").post(gameController.shuffleCards);
    app.route("/game/dealCards").post(gameController.dealCards);
    app.route("/game/dropCard").post(gameController.dropCard);
};
//# sourceMappingURL=gameroutes.js.map