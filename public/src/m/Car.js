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

/**********************************
 * Storage management
 *********************************/

// get all the cars from Firestore
Car.retrieveAll = async function() {
    try {
        let carRecords = (await db.collection("cars").get()).docs.map((d) =>
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
    await db.collection("cars").doc(slots.licensePlate).set(slots);
    console.log(`Car record ${slots.licensePlate} created.`);
};

Car.update = async function(slots) {
    if (Object.keys(slots).length > 0) {
        await db.collection("cars").doc(slots.licensePlate).update(slots);
        console.log(`Car record ${slots.licensePlate} modified.`);
    }
};

Car.destroy = async function(licensePlate) {
    try {
        await db.collection("cars").doc(licensePlate).delete();
        console.log(`Car record ${licensePlate} deleted.`);
    } catch (error) {
        console.error(`Error deleting book record ${error}`);
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