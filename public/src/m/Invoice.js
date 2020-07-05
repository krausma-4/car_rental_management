class Invoice {
    constructor({ invoice_id }) {
        this.invoice_id = invoice_id;
    }

    get invoice_id() {
        return this._invoice_id;
    }

    set invoice_id(id) {
        this._invoice_id = id;
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