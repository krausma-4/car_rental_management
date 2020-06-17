class Car {
  constructor({ licensePlate, manufacturer, model, damages }) {
    this.licensePlate = licensePlate;
    this.manufacturer = manufacturer;
    this.model = model;
    if (damages) {
      this.damages = damages;
    }
  }

  get licensePlate() {
    return _licensePlate;
  }

  set licensePlate(id) {
    this._licensePlate = id;
  }

  get manufacturer() {
    return _manufacturer;
  }
  set manufacturer(man) {
    this._manufacturer = man;
  }

  get model() {
    return _model;
  }

  set model(mod) {
    this._model = mod;
  }

  get damages() {
    return _damages;
  }

  set damages(allDamages) {
    this._damages = allDamages;
  }
}

Car.prototype = {};


