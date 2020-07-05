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

    // All basic constraints of the license plate attribute
    static checkLicensePlate(licensePlate) {
            if (licensePlate === undefined) return new NoConstraintViolation();
            else if (typeof licensePlate !== "string" || licensePlate.trim() === "") {
                return new RangeConstraintViolation(
                    "The ISBN must be a non-empty string!"
                );
            } else {
                return new NoConstraintViolation();
            }
        }
        // Mandatory value and uniqueness constraints
    static async checkLicensePlateAsId(licensePlate) {
        let validationResult = Car.checkLicensePlate(licensePlate);
        console.log(licensePlate);
        console.log(util.isIntegerOrIntegerString(parseInt(licensePlate)));
        if (validationResult instanceof NoConstraintViolation) {
            if (!licensePlate || !util.isNonEmptyString(licensePlate)) {
                validationResult = new MandatoryValueConstraintViolation(
                    "A value for the license plate must be provided!"
                );
            } else {
                let car = await db.collection("cars").doc(licensePlate).get();
                if (car.exists) {
                    validationResult = new UniquenessConstraintViolation(
                        "There is already a car with this license plate!"
                    );
                } else if (!util.isIntegerOrIntegerString(parseInt(licensePlate))) {
                    validationResult = new PatternConstraintViolation("An ID should alway be in digit form");
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
        const validationResult = Car.checkLicensePlate(id);
        if (validationResult instanceof NoConstraintViolation) {
            this._licensePlate = id;
        } else {
            throw validationResult;
        }
    }
    static checkManufacturer(man) {
        if (man === undefined) {
            return new MandatoryValueConstraintViolation(
                "A manufacturer must be provided!"
            );
        } else if (!util.isNonEmptyString(man)) {
            return new RangeConstraintViolation(
                "The manufacturer must be a non-empty string!"
            );
        } else {
            return new NoConstraintViolation();
        }
    }
    get manufacturer() {
        return _manufacturer;
    }
    set manufacturer(man) {
        const validationResult = Car.checkManufacturer(man);
        if (validationResult instanceof NoConstraintViolation) {
            this._manufaturer = man;
        } else {
            throw validationResult;
        }
    }
    static checkModel(mod) {
        if (mod === undefined) {
            return new MandatoryValueConstraintViolation("A model must be provided!");
        } else if (!util.isNonEmptyString(mod)) {
            return new RangeConstraintViolation(
                "The model must be a non-empty string!"
            );
        } else {
            return new NoConstraintViolation();
        }
    }
    get model() {
        return _model;
    }
    set model(mod) {
        const validationResult = Car.checkModel(mod);
        if (validationResult instanceof NoConstraintViolation) {
            this._model = mod;
        } else {
            throw validationResult;
        }
    }
    static checkDamages(dam) {
        // the "edition" attribute is optional
        if (dam === undefined || dam === "") return new NoConstraintViolation();
        else {
            if (util.isIntegerOrIntegerString(dam)) {
                return new RangeConstraintViolation(
                    "Please describe the damage in plain text!"
                );
            } else {
                return new NoConstraintViolation();
            }
        }
    }
    get damages() {
        return _damages;
    }

    set damages(allDamages) {
        const validationResult = Car.checkDamages(dam);
        if (validationResult instanceof NoConstraintViolation) {
            if (dam === undefined || dam === "") delete this.damages;
            // unset optional property
            else this.damages = dam;
        } else {
            throw validationResult;
        }
    }
}

/**********************************
 * Storage management
 *********************************/

// get all the cars from Firestore
Car.retrieveAll = async function() {
    try {
        const carRecords = (await db.collection("cars").get()).docs.map((d) =>
            d.data()
        );
        console.log(`${carRecords.length} car records retrieved`);
        return carRecords;
    } catch (error) {
        console.error(`Error getting car records: ${error}`);
    }
};

// get only one car from Firestore
Car.retrieve = async function(licensePlate) {
    try {
        let carRecord = (
            await db.collection("cars").doc(licensePlate).get()
        ).data();
        return carRecord;
    } catch (error) {
        console.error(`Error getting car records: ${error}`);
    }
};

// Create a Firestore doc in collection "cars"
Car.add = async function(slots) {
    let validationResult = await Car.checkLicensePlateAsId(slots.licensePlate);
    if (!(validationResult instanceof NoConstraintViolation)) {
        throw validationResult;
    }
    validationResult = Car.checkManufacturer(slots.manufacturer);
    if (!(validationResult instanceof NoConstraintViolation)) {
        throw validationResult;
    }
    validationResult = Car.checkModel(slots.model);
    if (!(validationResult instanceof NoConstraintViolation)) {
        throw validationResult;
    }
    validationResult = Car.checkDamages(slots.damages);
    if (!(validationResult instanceof NoConstraintViolation)) {
        throw validationResult;
    }
    await db.collection("cars").doc(slots.licensePlate).set(slots);
    console.log(`Car record ${slots.licensePlate} created.`);
};

Car.update = async function(slots) {
    // retrieve up-to-date car record
    const carRec = (
        await db.collection("cars").doc(slots.licensePlate).get()
    ).data();
    const updatedSlots = {};
    let validationResult = null;
    if (carRec.manufacturer !== slots.manufacturer) {
        validationResult = Car.checkManufacturer(slots.manufacturer);
        if (validationResult instanceof NoConstraintViolation) {
            updatedSlots.manufacturer = slots.manufacturer;
        } else {
            throw validationResult;
        }
    }
    if (carRec.model !== slots.model) {
        validationResult = Car.checkModel(slots.model);
        if (validationResult instanceof NoConstraintViolation) {
            updatedSlots.model = slots.model;
        } else {
            throw validationResult;
        }
    }
    if (slots.damages && slots.damages !== carRec.damages) {
        // slots.damages has a non-empty value that is different from the old value
        validationResult = Car.checkDamages(slots.damages);
        if (validationResult instanceof NoConstraintViolation) {
            updatedSlots.damages = slots.damages;
        } else {
            throw validationResult;
        }
    } else if (!slots.damages && carRec.damages !== undefined) {
        // slots.damages has an empty value while the old value was not empty
        updatedSlots.damages = firebase.firestore.FieldValue.delete();
    }
    let updatedProperties = Object.keys(updatedSlots);
    if (updatedProperties.length > 0) {
        await db.collection("cars").doc(slots.licensePlate).update(updatedSlots);
        console.log(
            `Car record ${
        updatedSlots.licensePlate
      } modified: ${updatedProperties.toString()}`
        );
    } else {
        console.log(
            `No property value changed for car record ${slots.licensePlate} !`
        );
    }
};

Car.destroy = async function(licensePlate) {
    try {
        await db.collection("cars").doc(licensePlate).delete();
        console.log(`Car record ${licensePlate} deleted.`);
    } catch (error) {
        console.error(`Error deleting car record ${error}`);
    }
};

Car.generateTestData = function() {
    let carRecords = {};
    carRecords["112233"] = {
        licensePlate: "112233",
        manufacturer: "Ford",
        model: "Fiesta",
    };
    carRecords["223344"] = {
        licensePlate: "223344",
        manufacturer: "Trabant",
        model: "601s",
    };
    carRecords["334455"] = {
        licensePlate: "334455",
        manufacturer: "McLaren",
        model: "F1",
    };
    carRecords["445566"] = {
        licensePlate: "445566",
        manufacturer: "Tesla",
        model: "Model X",
    };
    carRecords["556677"] = {
        licensePlate: "556677",
        manufacturer: "Toyota",
        model: "Corolla",
    };
    // Save all test Book records to Firestore DB
    for (let licensePlate of Object.keys(carRecords)) {
        let carRecord = carRecords[licensePlate];
        db.collection("cars").doc(licensePlate).set(carRecord);
    }
    console.log(`${Object.keys(carRecords).length} cars saved.`);
};

Car.clearData = function() {
    if (confirm("Do you really want to delete all cars records?")) {
        db.collection("cars")
            .get()
            .then(function(allCars) {
                // Delete book docs iteratively
                allCars.forEach(function(carDocs) {
                    db.collection("cars").doc(carDocs.id).delete();
                });
            });
    }
};