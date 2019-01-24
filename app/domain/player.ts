import { Card } from "./card";
export class Player {
  playerid: string;
  winposition: number;
  sittingposition: number;
  playername: string;
  creditbalance: number;
  cards: Card[] = [];
  cardsaffectedbycallingcards: Card[] = [];
}
