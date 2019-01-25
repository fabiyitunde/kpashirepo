import { CardType } from "./cardType";
import { SuitType } from "./suitType";

export class Card {
  suitType: SuitType;
  cardType: CardType;
  constructor(suitType: Number, cardType: Number) {
    this.cardType = <CardType>cardType;
    this.suitType = <SuitType>suitType;
  }
}
