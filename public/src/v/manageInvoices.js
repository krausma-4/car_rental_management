car_rental.v.invoice.listAllInvoices = {
    setupUserInterface: async function() {
        const tableBodyEl = document.querySelector("table#invoices>tbody");

        var invoiceRecords = await Invoice.retrieveAll();

        for (let invoiceRec of invoiceRecords) {
            let row = tableBodyEl.insertRow(),
                cust,
                rentedCar = "";
            try {
                cust = await Customer.retrieve(invoiceRec.customer);
            } catch (error) {}
            try {
                rentedCar = await Car.retrieve(invoiceRec.car);
            } catch (error) {}


            if (cust === undefined || rentedCar === undefined) {
                console.log(invoiceRec.invoice_id);
                await Invoice.destroy(invoiceRec.invoice_id);
                await RentalAgreement.destroy(invoiceRec.invoice_id);
            } else {
                row.insertCell(-1).textContent = invoiceRec.invoice_id;
                row.insertCell(-1).textContent = cust.name + " " + cust.surname;
                row.insertCell(-1).textContent =
                    rentedCar.manufacturer + " " + rentedCar.model;
            }
        }
    },
};

car_rental.v.invoice.createInvoice = {
    setupUserInterface: async function() {
        const formEl = document.forms["Invoice-C"],
            saveButton = document.forms["Invoice-C"].commit,
            selectCustEl = formEl.customer,
            selectCarEl = formEl.car;

        var allCustomers = await Customer.retrieveAll();
        var allCars = await Car.retrieveAll();
        let customer, car;

        for (let custRec of allCustomers) {
            let optionEl = document.createElement("option");
            optionEl.text = custRec.name;
            optionEl.value = custRec.customersId;
            selectCustEl.add(optionEl, null);
        }

        for (let carRec of allCars) {
            let optionEl = document.createElement("option");
            optionEl.text = carRec.model;
            optionEl.value = carRec.licensePlate;
            selectCarEl.add(optionEl, null);
        }

        selectCustEl.addEventListener("change", function() {
            for (let custRec of allCustomers) {
                if (custRec.customersId === selectCustEl.value) {
                    customer = custRec.customersId;
                }
            }
        });

        selectCarEl.addEventListener("change", function() {
            for (let carRec of allCars) {
                if (carRec.licensePlate === selectCarEl.value) {
                    car = carRec.licensePlate;
                }
            }
        });

        formEl.invoiceId.addEventListener("input", async function() {
            const validationResult = await Invoice.checkInvoiceIdAsId(
                formEl.invoiceId.value
            );
            formEl.invoiceId.setCustomValidity(validationResult.message);
        });
        formEl.customer.addEventListener("change", function() {
            console.log(customer);
            const validationResult = Invoice.checkCustomer(customer);
            formEl.customer.setCustomValidity(validationResult.message);
        });
        formEl.car.addEventListener("change", function() {
            const validationResult = Invoice.checkCar(car);
            formEl.car.setCustomValidity(validationResult.message);
        });

        console.log(customer);
        // set an event handler for the submit/save button
        saveButton.addEventListener("click", async function() {
            //await db.collection("cars").doc(selectCarEl.value).get().data()

            console.log(formEl.invoiceId.value);

            formEl.invoiceId.setCustomValidity(
                (await Invoice.checkInvoiceIdAsId(formEl.invoiceId.value)).message
            );
            console.log(Invoice.checkCustomer(customer));

            formEl.customer.setCustomValidity(
                Invoice.checkCustomer(customer).message
            );

            formEl.car.setCustomValidity(Invoice.checkCar(car).message);

            const slots = {
                invoiceId: formEl.invoiceId.value,
                customer: customer,
                car: car,
                startDate: new Date().toISOString().slice(0, 10),
                endDate: new Date().toISOString().slice(0, 10),
                price: "",
            };
            const invoiceSlots = {
                invoice_id: formEl.invoiceId.value,
                customer: customer,
                car: car,
            };


            if (formEl.checkValidity()) {
                await Invoice.add(invoiceSlots);
                await RentalAgreement.add(slots);
                formEl.reset();
            }
        });
    },
};

car_rental.v.invoice.updateInvoice = {
    setupUserInterface: async function() {
        const formEl = document.forms["Invoice-U"],
            updateButton = formEl.commit,
            selectInvoiceEl = formEl.selectInvoice,
            selectCustEl = formEl.customer,
            selectCarEl = formEl.car;
        var allCustomers = await Customer.retrieveAll();
        var allCars = await Car.retrieveAll();
        let car,
            customer = "";
        // load all car records
        const rentRecords = await Invoice.retrieveAll();
        for (let rentRec of rentRecords) {
            let optionEl = document.createElement("option");
            optionEl.text = rentRec.invoice_id;
            optionEl.value = rentRec.invoice_id;
            selectInvoiceEl.add(optionEl, null);
        }

        for (let custRec of allCustomers) {
            let optionEl = document.createElement("option");
            optionEl.text = custRec.name;
            optionEl.value = custRec.customersId;
            selectCustEl.add(optionEl, null);
        }

        for (let carRec of allCars) {
            let optionEl = document.createElement("option");
            optionEl.text = carRec.model;
            optionEl.value = carRec.licensePlate;
            selectCarEl.add(optionEl, null);
        }

        selectCustEl.addEventListener("change", function() {
            for (let custRec of allCustomers) {
                if (custRec.customersId === selectCustEl.value) {
                    customer = custRec.customersId;
                }
            }
        });

        selectCarEl.addEventListener("change", function() {
            for (let carRec of allCars) {
                if (carRec.licensePlate === selectCarEl.value) {
                    car = carRec.licensePlate;
                }
            }
        });

        // when a car is selected, fill the form with its data
        selectInvoiceEl.addEventListener("change", async function() {
            const rentRecord = await Invoice.retrieve(selectInvoiceEl.value);

            let custRecord = await Customer.retrieve(rentRecord.customer),
                carRecord = await Car.retrieve(rentRecord.car);
            customer = custRecord.customersId;
            car = carRecord.licensePlate;

            const invoiceID = selectInvoiceEl.value;

            if (invoiceID) {
                // retrieve up-to-date car record
                const rentRec = await Invoice.retrieve(invoiceID);
                (custRecord = await Customer.retrieve(rentRec.customer)),
                (carRecord = await Car.retrieve(rentRec.car)),
                (customer = custRecord.customersId),
                (car = carRecord.licensePlate);

                formEl.invoiceId.value = rentRec.invoice_id;
                document.getElementById("custOption").textContent = custRecord.name;
                document.getElementById("carOption").textContent = carRecord.model;
            } else {
                formEl.reset();
            }
        });

        formEl.customer.addEventListener("change", function() {
            const validationResult = Invoice.checkCustomer(customer.customersId);
            formEl.customer.setCustomValidity(validationResult.message);
        });
        formEl.car.addEventListener("change", function() {
            const validationResult = Invoice.checkCar(car.licensePlate);
            formEl.car.setCustomValidity(validationResult.message);
        });
        // set an event handler for the submit/save button
        updateButton.addEventListener("click", async function() {
            formEl.customer.setCustomValidity(
                Invoice.checkCustomer(customer.customersId).message
            );

            formEl.car.setCustomValidity(Invoice.checkCar(car.licensePlate).message);
            // save data
            const slots = {
                invoiceId: formEl.invoiceId.value,
                customer: customer,
                car: car,
                startDate: new Date().toISOString().slice(0, 10),
                endDate: new Date().toISOString().slice(0, 10),
                price: "",
            };

            const invoiceSlots = {
                invoice_id: formEl.invoiceId.value,
                customer: customer,
                car: car,
            };

            if (formEl.checkValidity()) {
                await RentalAgreement.update(slots);
                await Invoice.update(invoiceSlots);

                // update the selection list option element

                selectInvoiceEl.options[selectInvoiceEl.selectedIndex].text =
                    slots.invoiceId;
                console.log(
                    selectInvoiceEl.options[selectInvoiceEl.selectedIndex].text
                );
                formEl.reset();
            }
        });
        // neutralize the submit event
        formEl.addEventListener("submit", function(e) {
            e.preventDefault();
        });
    },
};

car_rental.v.invoice.deleteInvoice = {
    setupUserInterface: async function() {
        const formEl = document.forms["Invoice-D"],
            deleteButton = formEl.commit,
            selectInvoiceEl = formEl.selectInvoice;
        // load all car records

        const rentRecords = await Invoice.retrieveAll();
        for (let rentRec of rentRecords) {
            let optionEl = document.createElement("option");
            optionEl.text = rentRec.invoice_id;
            optionEl.value = rentRec.invoice_id;
            selectInvoiceEl.add(optionEl, null);
        }

        // Set an event handler for the submit/delete button
        deleteButton.addEventListener(
            "click",
            car_rental.v.invoice.deleteInvoice.handleDeleteButtonClickEvent
        );
    },
    // Event handler for deleting a book
    handleDeleteButtonClickEvent: async function() {
        const selectInvoiceEl = document.forms["Invoice-D"].selectInvoice;
        const invoiceID = selectInvoiceEl.value;
        if (invoiceID) {
            await Invoice.destroy(invoiceID);
            await RentalAgreement.destroy(invoiceID);
            // remove deleted book from select options
            selectInvoiceEl.remove(selectInvoiceEl.selectedIndex);
        }
    },
};