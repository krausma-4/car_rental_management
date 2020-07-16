class Customer {
    constructor({ customersId, name, surname, dateOfBirth, address }) {
        (this._customersId = ""),
        (this._name = ""),
        (this._surname = ""),
        (this._dateOfBirth = ""),
        (this._address = "");

        this.customersId = customersId;
        this.custName = name;
        this.custSurname = surname;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
    }

    get customersId() {
        return this._customersId;
    }

    static checkCustomersId(id) {
        if (id === undefined) return new NoConstraintViolation();
        else if (typeof id !== "string" || id.trim() === "") {
            return new RangeConstraintViolation("The ID must be a non-empty string!");
        } else {
            return new NoConstraintViolation();
        }
    }

    static async checkcustomersIdAsId(customersId) {
        let validationResult = Customer.checkCustomersId(customersId);

        if (validationResult instanceof NoConstraintViolation) {
            if (!customersId || !util.isNonEmptyString(customersId)) {
                validationResult = new MandatoryValueConstraintViolation(
                    "A value for the customer's ID must be provided!"
                );
            } else {
                let customer = await db.collection("customers").doc(customersId).get();
                if (customer.exists) {
                    validationResult = new UniquenessConstraintViolation(
                        "There is already a customer with this ID!"
                    );
                } else if (!util.isIntegerOrIntegerString(parseInt(customersId))) {
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

    set customersId(id) {
        const validationResult = Customer.checkCustomersId(id);
        if (validationResult instanceof NoConstraintViolation) {
            this._customersId = id;
        } else {
            throw validationResult;
        }
    }

    get custName() {
        return this._name;
    }

    static checkName(name) {
        if (name === undefined) {
            return new MandatoryValueConstraintViolation("A name must be provided!");
        } else if (!util.isNonEmptyString(name)) {
            return new RangeConstraintViolation(
                "The name must be a non-empty string!"
            );
        } else {
            return new NoConstraintViolation();
        }
    }
    set custName(n) {
        const validationResult = Customer.checkName(n);
        if (validationResult instanceof NoConstraintViolation) {
            this._name = n;
        } else {
            throw validationResult;
        }
    }

    get custSurname() {
        return this._surname;
    }

    set custSurname(sn) {
        const validationResult = Customer.checkName(sn);
        if (validationResult instanceof NoConstraintViolation) {
            this._surname = sn;
        } else {
            throw validationResult;
        }
    }

    get dateOfBirth() {
        return this._dateOfBirth;
    }

    static checkBirthday(date) {
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

    set dateOfBirth(date) {
        const validationResult = Customer.checkName(date);
        if (validationResult instanceof NoConstraintViolation) {
            this._dateOfBirth = date;
        } else {
            throw validationResult;
        }
    }

    get address() {
        return this._address;
    }

    static checkAddress(a) {
        if (a === undefined) {
            return new MandatoryValueConstraintViolation(
                "An address must be provided!"
            );
        } else if (!util.isNonEmptyString(a)) {
            return new RangeConstraintViolation(
                "The address must be a non-empty string!"
            );
        } else {
            return new NoConstraintViolation();
        }
    }

    set address(a) {
        const validationResult = Customer.checkAddress(a);
        if (validationResult instanceof NoConstraintViolation) {
            this._address = a;
        } else {
            throw validationResult;
        }
    }
}

Customer.retrieveAll = async function() {
    try {
        let custRecords = (await db.collection("customers").get()).docs.map((d) =>
            d.data()
        );
        console.log(`${custRecords.length} customers records retrieved`);
        return custRecords;
    } catch (error) {
        console.error(`Error getting customer records: ${error}`);
    }
};

Customer.retrieve = async function(customerId) {
    try {
        let custRecord = (
            await db.collection("customers").doc(customerId).get()
        ).data();
        return custRecord;
    } catch (error) {
        console.error(`Error getting customer records: ${error}`);
    }
};

Customer.add = async function(slots) {
    await db.collection("customers").doc(slots.customersId).set(slots);
    console.log(`Customer record ${slots.customersId} created.`);
};

Customer.update = async function(slots) {
    if (Object.keys(slots).length > 0) {
        await db.collection("customers").doc(slots.customersId).update(slots);
        console.log(`Customer record ${slots.customersId} modified.`);
    }
};

Customer.destroy = async function(customerId) {
    try {
        await db.collection("customers").doc(customerId).delete();
        console.log(`Customer record ${customerId} deleted.`);
    } catch (error) {
        console.error(`Error deleting book record ${error}`);
    }
};

Customer.generateTestData = function() {
    let custRecords = {};
    custRecords["112233"] = {
        customersId: "112233",
        name: "Elias",
        surname: "Bob",
        dateOfBirth: Date("12-05-1995"),
        address: "Erich-Weinert-Strasse 6",
    };
    custRecords["223344"] = {
        customersId: "223344",
        name: "Morgan",
        surname: "Freeman",
        dateOfBirth: Date("12-05-1980"),
        address: "Erich-Weinert-Strasse 3",
    };

    // Save all test Book records to Firestore DB
    for (let id of Object.keys(custRecords)) {
        let carRecord = custRecords[id];
        db.collection("customers").doc(id).set(carRecord);
    }
    console.log(`${Object.keys(custRecords).length} customers saved.`);
};

Customer.clearData = function() {
    if (confirm("Do you really want to delete all customers' records?")) {
        db.collection("customers")
            .get()
            .then(function(allCustomers) {
                // Delete book docs iteratively
                allCustomers.forEach(function(custDocs) {
                    db.collection("customers").doc(custDocs.id).delete();
                });
            });
    }
};