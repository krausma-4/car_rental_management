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

    static checkInvoiceId(id) {
        if (id === undefined) return new NoConstraintViolation();
        else if (typeof id !== "string" || id.trim() === "") {
            return new RangeConstraintViolation("The ID must be a non-empty string!");
        } else {
            return new NoConstraintViolation();
        }
    }

    static async checkInvoiceIdAsId(id) {
        let validationResult = RentalAgreement.checkInvoiceId(id);

        if (validationResult instanceof NoConstraintViolation) {
            if (!id || !util.isNonEmptyString(id)) {
                validationResult = new MandatoryValueConstraintViolation(
                    "A value for the ID must be provided!"
                );
            } else {
                let rent = await db.collection("rentalAgreements").doc(id).get();
                if (rent.exists) {
                    validationResult = new UniquenessConstraintViolation(
                        "There is already a rental agreement or invoice with this ID!"
                    );
                } else if (!util.isIntegerOrIntegerString(parseInt(id))) {
                    validationResult = new PatternConstraintViolation(
                        "An ID should alway be in digit form"
                    );
                } else {
                    validationResult = new NoConstraintViolation();
                }
            }
        }
        return validationResult;
    }

    set invoiceID(id) {
        const validationResult = RentalAgreement.checkInvoiceId(id);
        if (validationResult instanceof NoConstraintViolation) {
            this._invoiceId = id;
        } else {
            throw validationResult;
        }
    }

    get customer() {
        return this._customer;
    }

    static checkCustomer(c) {
        if (c === undefined) {
            return new MandatoryValueConstraintViolation(
                "A customer must be provided!"
            );
        } else if (!util.isNonEmptyString(c)) {
            return new RangeConstraintViolation(
                "The customer must be a non-empty string!"
            );
        } else {
            return new NoConstraintViolation();
        }
    }

    set customer(cust) {
        const validationResult = RentalAgreement.checkCustomer(cust);
        if (validationResult instanceof NoConstraintViolation) {
            this._customer = cust;
        } else {
            throw validationResult;
        }
    }

    get car() {
        return this._car;
    }

    static checkCar(c) {
        if (c === undefined) {
            return new MandatoryValueConstraintViolation("A car must be provided!");
        } else if (!util.isNonEmptyString(c)) {
            return new RangeConstraintViolation(
                "The car must be a non-empty string!"
            );
        } else {
            return new NoConstraintViolation();
        }
    }

    set car(c) {
        const validationResult = RentalAgreement.checkCar(c);
        if (validationResult instanceof NoConstraintViolation) {
            this._car = c;
        } else {
            throw validationResult;
        }
    }

    get startDate() {
        return this._startDate;
    }

    static checkDate(date) {
        if (date === undefined) {
            return new MandatoryValueConstraintViolation("A date must be provided!");
        } else if (!util.isNonEmptyString(date)) {
            return new RangeConstraintViolation(
                "The date must be a non-empty string!"
            );
        } else {
            return new NoConstraintViolation();
        }
    }

    set startDate(s) {
        const validationResult = RentalAgreement.checkDate(s);
        if (validationResult instanceof NoConstraintViolation) {
            this._startDate = s;
        } else {
            throw validationResult;
        }
    }

    get endDate() {
        return this._endDate;
    }

    set endDate(e) {
        const validationResult = RentalAgreement.checkDate(e);
        if (validationResult instanceof NoConstraintViolation) {
            this._endDate = e;
        } else {
            throw validationResult;
        }
    }

    get price() {
        return this._price;
    }

    static checkPrice(p) {
        console.log(parseInt(p));
        if (p === undefined) {
            return new MandatoryValueConstraintViolation("A price must be provided!");
        } else if (!util.isNonEmptyString(p)) {
            return new RangeConstraintViolation(
                "The price must be a non-empty string!"
            );
        } else if (!util.isIntegerOrIntegerString(parseInt(p))) {
            validationResult = new PatternConstraintViolation(
                "An ID should alway be in digit form"
            );
        } else {
            return new NoConstraintViolation();
        }
    }

    set price(p) {
        const validationResult = RentalAgreement.checkPrice(p);
        if (validationResult instanceof NoConstraintViolation) {
            this._price = p;
        } else {
            throw validationResult;
        }

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
            dateOfBirth: new Date(1995, 05, 12).toISOString().slice(0, 10),
            address: "Erich-Weinert-Strasse 6",
        },
        cust2 = {
            customersId: "13",
            name: "Martin",
            surname: "Haris",
            dateOfBirth: new Date(1990, 10, 01).toISOString().slice(0, 10),
            address: "Erich-Weinert-Strasse 3",
        };

    Car.add(car1);
    Car.add(car2);
    Customer.add(cust1);
    Customer.add(cust2);

    let rentRecords = {};
    let invoiceRecords = {};
    rentRecords["112233"] = {
        invoiceId: "112233",
        customer: cust1.customersId,
        car: car1.licensePlate,
        startDate: new Date(2020, 05, 12).toISOString().slice(0, 10),
        endDate: new Date(2020, 05, 20).toISOString().slice(0, 10),
        price: "179,98",
    };
    invoiceRecords["112233"] = {
        invoice_id: "112233",
        customer: cust1.customersId,
        car: car1.licensePlate,

    };
    rentRecords["123467"] = {
        invoiceId: "123467",
        customer: cust2.customersId,
        car: car2.licensePlate,
        startDate: new Date(2020, 02, 12).toISOString().slice(0, 10),
        endDate: new Date(2020, 03, 12).toISOString().slice(0, 10),
        price: "289",
    };

    invoiceRecords["123467"] = {
        invoice_id: "123467",
        customer: cust2.customersId,
        car: car2.licensePlate,

    };
    // Save all test Book records to Firestore DB
    for (let id of Object.keys(rentRecords)) {
        let rentRecord = rentRecords[id];
        let invoiceRec = invoiceRecords[id];
        db.collection("rentalAgreements").doc(id).set(rentRecord);
        db.collection("invoice").doc(id).set(invoiceRec);
    }
    console.log(`${Object.keys(rentRecords).length} rent agreements saved.`);
    console.log(`${Object.keys(invoiceRecords).length} invoices saved.`);
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