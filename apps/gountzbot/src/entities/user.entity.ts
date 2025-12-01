export class User {
  private _ref: string;
  private _isMod: boolean;
  private _isCreator: boolean;
  private _platform: string;

  get ref() {
    return this._ref;
  }

  set ref(ref: string) {
    this._ref = ref;
  }

  get isMod() {
    return this._isMod;
  }

  set isMod(isMod: boolean) {
    this._isMod = isMod;
  }

  get isCreator() {
    return this._isCreator;
  }

  set isCreator(isCreator: boolean) {
    this._isCreator = isCreator;
  }

  get platform() {
    return this._platform;
  }

  set platform(platform: string) {
    this._platform = platform;
  }
}
