class Car {
  constructor({ licensePlate, manufacturer, model, damages }) {
    // set default properties
    this._licensePlate = "";
    this._manufacturer = "";
    this._model = "";
    this._damages = "";
    // if arguments set properties
    if (arguments.length > 0) {
      this.licensePlate = licensePlate;
      this.manufacturer = manufacturer;
      this.model = model;
      if (damages) {
        this.damages = damages; // optional
      }
    }
  }

  // All basic constraints of the isbn attribute
  static checkLicensePlate (licensePlate) {
    if (licensePlate === undefined) return new NoConstraintViolation();
    else if (typeof(licensePlate) !== "string" || licensePlate.trim() === "") {
      return new RangeConstraintViolation("The ISBN must be a non-empty string!");
    } else if (!(/\b\d{9}(\d|X)\b/.test( licensePlate))) { // TODO: isbnRegEx falsch hier
      return new PatternConstraintViolation(
        'The ISBN must be a 10-digit string or a 9-digit string followed by "X"!');
    } else {
      return new NoConstraintViolation();
    }
  }
  // Mandatory value and uniqueness constraints
  static async checkIsbnAsId( licensePlate) {
    let validationResult = Car.checkLicensePlate( licensePlate);
    if ((validationResult instanceof NoConstraintViolation)) {
      if (!licensePlate) {
        validationResult = new MandatoryValueConstraintViolation(
          "A value for the license plate must be provided!");
      } else {
        let car = await db.collection("cars").doc(licensePlate).get();
        if (car.exists) {
          validationResult = new UniquenessConstraintViolation(
              "There is already a car with this license plate!");
        } else {
          validationResult = new NoConstraintViolation();
        }
      }
    }
    return validationResult;
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

/**********************************
 * Storage management
 *********************************/

// get all the cars from Firestore
Car.retrieveAll = async function (){
  try {
    const carRecords = (await db.collection("cars").get()).docs.map( d => d.data());
    console.log(`${carRecords.length} car records retrieved`);
    return carRecords;
  }catch( error){
    console.error(`Error getting car records: ${error}`);
  }
};

// get only one car from Firestore
Car.retrieve = async function (licensePlate) {
  try{
    let carRecord = (await db.collection("cars").doc( licensePlate).get()).data()
    return carRecord;
  } catch( error) {
    console.error(`Error getting car records: ${error}`);
  }
}

// Create a Firestore doc in collection "cars"
//TODO
Car.add = async function (slots) {
  await db.collection("cars").doc( slots.licensePlate).set( slots);
  console.log(`Car record ${slots.licensePlate} created.`);
}

//TODO
Car.update = async function (slots) {
  if (Object.keys( slots).length > 0) {
    await db.collection("cars").doc(slots.licensePlate).update(slots);
    console.log(`Car record ${slots.licensePlate} modified.`);
  }
};

Car.destroy = async function (licensePlate) {
  try {
    await db.collection("cars").doc( licensePlate).delete();
    console.log(`Car record ${licensePlate} deleted.`);
  } catch( error) {
    console.error(`Error deleting book record ${error}`);
  }
};


/**********************************************
 * Testing methods
**********************************************/
Car.generateTestData = function () {
  let carRecords = {};
  carRecords["112233"] = {licensePlate: "112233",
    manufacturer: "Ford", model: "Fiesta"};
  carRecords["223344"] = {licensePlate: "223344",
    manufacturer: "Trabant", model: "601s"};
  carRecords["334455"] = {licensePlate: "334455",
    manufacturer: "McLaren", model: "F1"};
  carRecords["445566"] = {licensePlate: "445566",
    manufacturer: "Tesla", model: "Model X"};
  carRecords["556677"] = {licensePlate: "556677",
    manufacturer: "Toyota", model: "Corolla"};
  // Save all test Book records to Firestore DB
  for (let licensePlate of Object.keys( carRecords)) {
    let carRecord = carRecords[licensePlate];
    db.collection("cars").doc( licensePlate).set( carRecord);
  }
  console.log(`${Object.keys( carRecords).length} cars saved.`);
};

Car.clearData = function () {
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
