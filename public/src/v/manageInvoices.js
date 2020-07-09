car_rental.v.invoice.listAllInvoices = {
    setupUserInterface: async function() {
        const tableBodyEl = document.querySelector("table#invoices>tbody");

        var invoiceRecords = await Invoice.retrieveAll();

        for (let invoiceRec of invoiceRecords) {
            let row = tableBodyEl.insertRow(),
                cust = await Customer.retrieve(invoiceRec.customer),
                rentedCar = await Car.retrieve(invoiceRec.car);
            row.insertCell(-1).textContent = invoiceRec.invoice_id;
            row.insertCell(-1).textContent = (cust.name + " " + cust.surname);
            row.insertCell(-1).textContent = (rentedCar.manufacturer + " " + rentedCar.model);
        }
    },
};

car_rental.v.invoice.createInvoice = {
    setupUserInterface: async function() {

    },
};

car_rental.v.invoice.updateInvoice = {
    setupUserInterface: async function() {

    },
};

car_rental.v.invoice.deleteInvoice = {
    setupUserInterface: async function() {

    },
};