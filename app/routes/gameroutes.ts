import { GameController } from "../controllers/gameController";
export const registerGameRoutes = app => {
  var gameController: GameController = new GameController();
  app.route("/game/startFirstGame").post(gameController.startFirstGame);
  app.route("/game/openGame").post(gameController.openGame);
  app.route("/game/shuffleCards").post(gameController.shuffleCards);
  app.route("/game/dealCards").post(gameController.dealCards);
  app.route("/game/dropCard").post(gameController.dropCard);
  app.route("/game/startNewGame").post(gameController.startNewGame);
  app.route("/game/iAmReadyToPlay").post(gameController.iAmReadyToPlay);
  app.route("/game/cancelCurrentGame").post(gameController.cancelCurrentGame);
};
