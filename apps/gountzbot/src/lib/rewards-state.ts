export class RewardsState {
  private _idBorder: string;
  private _idCard: string;
  borderSpecial: boolean;
  cardSpecial: boolean;

  constructor() {
    this.borderSpecial = false;
    this.cardSpecial = false;
  }

  toggleBorderSpecial() {
    this.borderSpecial = !this.borderSpecial;
  }

  toggleCardSpecial() {
    this.cardSpecial = !this.cardSpecial;
  }

  get isBorderActive() {
    return this.borderSpecial;
  }

  get isCardActive() {
    return this.cardSpecial;
  }

  get idBorder() {
    return this._idBorder;
  }

  set idBorder(id: string) {
    this._idBorder = id;
  }

  get idCard() {
    return this._idCard;
  }

  set idCard(id: string) {
    this._idCard = id;
  }
}
