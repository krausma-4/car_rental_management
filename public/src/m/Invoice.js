class Invoice {
    constructor({ invoice_id, customer, car }) {
        this.invoice_id = invoice_id;
        this.customer = customer;
        this.car = car;
    }

    get invoice_id() {
        return this._invoice_id;
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
        let validationResult = Invoice.checkInvoiceId(id);

        if (validationResult instanceof NoConstraintViolation) {
            if (!id || !util.isNonEmptyString(id)) {
                validationResult = new MandatoryValueConstraintViolation(
                    "A value for the ID must be provided!"
                );
            } else {
                let rent = await db.collection("invoice").doc(id).get();
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
    set invoice_id(id) {
        const validationResult = Invoice.checkInvoiceId(id);
        if (validationResult instanceof NoConstraintViolation) {
            this._invoice_id = id;
        } else {
            throw validationResult;
        }
    }

    get customer() {
        return this._customer;
    }

    static checkCustomer(c) {
        console.log(c);

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

    set customer(c) {
        const validationResult = Invoice.checkCustomer(c);
        if (validationResult instanceof NoConstraintViolation) {
            this._customer = c;
        } else {
            throw validationResult;
        }

    }

    get car() {
        return this._car;
    }

    static checkCar(c) {
        console.log(c);
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
        const validationResult = Invoice.checkCar(c);
        if (validationResult instanceof NoConstraintViolation) {
            this._car = c;
        } else {
            throw validationResult;
        }
    }
}
Invoice.retrieveAll = async function() {
    try {
        let invoiceRecords = (await db.collection("invoice").get()).docs.map((d) =>
            d.data()
        );
        console.log(`${invoiceRecords.length} invoices records retrieved`);
        return invoiceRecords;
    } catch (error) {
        console.error(`Error getting invoice records: ${error}`);
    }
};

Invoice.retrieve = async function(invoiceId) {
    try {
        let invoiceRecord = (
            await db.collection("invoice").doc(invoiceId).get()
        ).data();
        return invoiceRecord;
    } catch (error) {
        console.error(`Error getting invoice records: ${error}`);
    }
};

Invoice.add = async function(slots) {
    await db.collection("invoice").doc(slots.invoice_id).set(slots);
    console.log(`Invoice record ${slots.invoice_id} created.`);
};

Invoice.update = async function(slots) {
    if (Object.keys(slots).length > 0) {
        await db.collection("invoice").doc(slots.invoice_id).update(slots);
        console.log(`Invoice record ${slots.invoice_id} modified.`);
    }
};

Invoice.destroy = async function(invoiceId) {
    try {
        await db.collection("invoice").doc(invoiceId).delete();
        console.log(`Invoice record ${invoiceId} deleted.`);
    } catch (error) {
        console.error(`Error deleting invoice record ${error}`);
    }
};

Invoice.clearData = function() {
    if (confirm("Do you really want to delete all invoices' records?")) {
        db.collection("invoice")
            .get()
            .then(function(allInvoices) {
                // Delete book docs iteratively
                allInvoices.forEach(function(invoiceDocs) {
                    db.collection("invoice").doc(invoiceDocs.id).delete();
                });
            });
    }
};