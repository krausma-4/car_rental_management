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

Car.listAllCars = async function () {
  if (db.collection("cars")) {
    let carsCollection = db.collection("cars");
    let allCars = await carsCollection.get();
    let carsDocs = allCars.docs;
    let carsrecords = carsDocs.map(car => car.data());
  }
};

Car.listAllInfoOfCar = async function (id) {
  if(db.collection("cars")){
    
  }
};

Car.create = async function (row) {};
Car.update = async function (row) {};
Car.delete = async function (row) {};

Car.generateTestData = function () {};

Car.clearDb = function () {};
