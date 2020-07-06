class RentalAgreement {
    constructor({ invoiceId, customer, car, startDate, endDate, price }) {
        (this._invoiceId = ""),
        (this._customer = ""),
        (this._car = ""),
        (this._startDate = ""),
        (this._endDate = ""),
        (this._price = "");

        this.invoiceID = invoiceId;
        this.customer = customer;
        this.car = car;
        this.startDate = startDate;
        this.endDate = endDate;
        this.price = price;
    }
    get invoiceID() {
        return this._invoiceId;
    }

    set invoiceID(id) {
        this._invoiceId = id;
    }

    get customer() {
        return this._customer;
    }

    set customer(cust) {
        this._customer = cust;
    }

    get car() {
        return this._car;
    }
    set car(c) {
        this._car = c;
    }

    get startDate() {
        return this._startDate;
    }

    set startDate(s) {
        this._startDate = s;
    }

    get endDate() {
        return this._endDate;
    }

    set endDate(e) {
        this._endDate = e;
    }

    get price() {
        return this._price;
    }

    set price(p) {
        this._price = p;
    }
}

RentalAgreement.retrieveAll = async function() {
    try {
        let rentRecords = (
            await db.collection("rentalAgreements").get()
        ).docs.map((d) => d.data());
        console.log(`${rentRecords.length} rental agreements records retrieved`);
        return rentRecords;
    } catch (error) {
        console.error(`Error getting rent records: ${error}`);
    }
};

RentalAgreement.retrieve = async function(rentID) {
    try {
        let rentRecord = (
            await db.collection("rentalAgreements").doc(rentID).get()
        ).data();
        return rentRecord;
    } catch (error) {
        console.error(`Error getting rent records: ${error}`);
    }
};

RentalAgreement.add = async function(slots) {
    await db.collection("rentalAgreements").doc(slots.invoiceId).set(slots);
    console.log(`Rent record ${slots.invoiceId} created.`);
};

RentalAgreement.update = async function(slots) {
    if (Object.keys(slots).length > 0) {
        await db.collection("rentalAgreements").doc(slots.invoiceId).update(slots);
        console.log(`Rent record ${slots.invoiceId} modified.`);
    }
};

RentalAgreement.destroy = async function(rentID) {
    try {
        await db.collection("rentalAgreements").doc(rentID).delete();
        console.log(`Rent record ${rentID} deleted.`);
    } catch (error) {
        console.error(`Error deleting rent record ${error}`);
    }
};

RentalAgreement.generateTestData = function() {
    let car1 = {
            licensePlate: "556677",
            manufacturer: "Toyota",
            model: "Corolla",
        },
        car2 = { licensePlate: "445566", manufacturer: "Tesla", model: "Model X" },
        cust1 = {
            customersId: "12",
            name: "Emin",
            surname: "Bob",
            dateOfBirth: (new Date(1995, 05, 12)).toISOString().slice(0, 10),
            address: "Erich-Weinert-Strasse 6",
        },
        cust2 = {
            customersId: "13",
            name: "Martin",
            surname: "Haris",
            dateOfBirth: (new Date(1990, 10, 01)).toISOString().slice(0, 10),
            address: "Erich-Weinert-Strasse 3",
        };

    Car.add(car1);
    Car.add(car2);
    Customer.add(cust1);
    Customer.add(cust2);

    let rentRecords = {};
    rentRecords["112233"] = {
        invoiceId: "112233",
        customer: cust1.customersId,
        car: car1.licensePlate,
        startDate: (new Date(2020, 05, 12)).toISOString().slice(0, 10),
        endDate: (new Date(2020, 05, 20)).toISOString().slice(0, 10),
        price: "179,98",
    };
    rentRecords["123467"] = {
        invoiceId: "123467",
        customer: cust2.customersId,
        car: car2.licensePlate,
        startDate: (new Date(2020, 02, 12)).toISOString().slice(0, 10),
        endDate: (new Date(2020, 03, 12)).toISOString().slice(0, 10),
        price: "289",
    };

    // Save all test Book records to Firestore DB
    for (let id of Object.keys(rentRecords)) {
        let rentRecord = rentRecords[id];
        db.collection("rentalAgreements").doc(id).set(rentRecord);
    }
    console.log(`${Object.keys(rentRecords).length} rent agreements saved.`);
};

RentalAgreement.clearData = function() {
    if (confirm("Do you really want to delete all rent Agreements?")) {
        db.collection("rentalAgreements")
            .get()
            .then(function(allRents) {
                // Delete book docs iteratively
                allRents.forEach(function(rentDocs) {
                    db.collection("rentalAgreements").doc(rentDocs.id).delete();
                });
            });
        db.collection("customers")
            .get()
            .then(function(allCustomers) {
                // Delete book docs iteratively
                allCustomers.forEach(function(custDocs) {
                    db.collection("customers").doc(custDocs.id).delete();
                });
            });
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