import { CardType } from "./cardType";
import { SuitType } from "./suitType";

export class Card {
  suitType: number;
  cardType: number;
  constructor(suitType: number, cardType: number) {
    this.cardType = cardType;
    this.suitType = suitType;
  }
}
