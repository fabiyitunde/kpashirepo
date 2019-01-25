import { Player } from "./player";
export class GameResult {
  player: Player;
  score: number;
  position: number;
  constructor(player: Player, score: number, position: number) {
    this.player = player;
    this.score = score;
    this.position = position;
  }
}
