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

    set customersId(id) {
        this._customersId = id;
    }

    get custName() {
        return this._name;
    }

    set custName(n) {
        this._name = n;
    }

    get custSurname() {
        return this._surname;
    }

    set custSurname(sn) {
        this._surname = sn;
    }

    get dateOfBirth() {
        return this._dateOfBirth;
    }

    set dateOfBirth(date) {
        this._dateOfBirth = date;
    }

    get address() {
        return this._address;
    }

    set address(a) {
        this._address = a;
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