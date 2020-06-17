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
    let carsrecords = carsDocs.map((car) => car.data());
  }
};

Car.listAllInfoOfCar = async function (id) {
  if (db.collection("cars")) {
  }
};

Car.create = async function (row) {
  await db.collection("cars").doc(row.licensePlate).set(row);
};
Car.update = async function (row) {
  if (Object.keys(row).length > 0) {
    await db.collection("cars").doc(row.licensePlate).update(row);
  }
};
Car.delete = async function (id) {
  await db.collection("cars").doc(id).delete();
};

Car.generateTestData = function () {};

Car.clearDb = function () {
  if (confirm("Do you really want to delete all cars records?")) {
    db.collection("cars")
      .get()
      .then(function (allCars) {
        // Delete book docs iteratively
        allCars.forEach(function (carDocs) {
          db.collection("cars").doc(carDocs.id).delete();
        });
      });
  }
};
