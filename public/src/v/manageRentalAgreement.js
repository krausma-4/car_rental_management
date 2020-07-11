car_rental.v.rentalAgreements.listAllRentAgreements = {
    setupUserInterface: async function() {
        const tableBodyEl = document.querySelector("table#rents>tbody");

        var rentRecords = await RentalAgreement.retrieveAll();

        for (let rentRec of rentRecords) {
            let row = tableBodyEl.insertRow();
            let cust,
                rentedCar = "";
            try {
                cust = (await Customer.retrieve(rentRec.customer));
            } catch (error) {}
            try {
                rentedCar = (await Car.retrieve(rentRec.car));
            } catch (error) {}


            if (cust === undefined || rentedCar === undefined) {
                console.log(rentRec.invoiceId);
                await RentalAgreement.destroy(rentRec.invoiceId);
                await Invoice.destroy(rentRec.invoiceId);
            } else {

                row.insertCell(-1).textContent = rentRec.invoiceId;
                row.insertCell(-1).textContent = cust.name + " " + cust.surname;
                row.insertCell(-1).textContent =
                    rentedCar.manufacturer + " " + rentedCar.model;
                row.insertCell(-1).textContent = rentRec.startDate;
                row.insertCell(-1).textContent = rentRec.endDate;
                row.insertCell(-1).textContent = rentRec.price;


            }
        }
    },
};

car_rental.v.rentalAgreements.createRentAgreement = {
    setupUserInterface: async function() {
        const formEl = document.forms["Rent-C"],
            saveButton = document.forms["Rent-C"].commit,
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
                    customer = custRec;
                }
            }
        });

        selectCarEl.addEventListener("change", function() {
            for (let carRec of allCars) {
                if (carRec.licensePlate === selectCarEl.value) {
                    car = carRec;
                }
            }
        });

        formEl.invoiceId.addEventListener("input", async function() {
            const validationResult = await RentalAgreement.checkInvoiceIdAsId(
                formEl.invoiceId.value
            );
            formEl.invoiceId.setCustomValidity(validationResult.message);
        });
        formEl.customer.addEventListener("change", function() {
            const validationResult = RentalAgreement.checkCustomer(
                customer.customersId
            );
            formEl.customer.setCustomValidity(validationResult.message);
        });
        formEl.car.addEventListener("change", function() {
            const validationResult = RentalAgreement.checkCar(car.licensePlate);
            formEl.car.setCustomValidity(validationResult.message);
        });
        formEl.start.addEventListener("input", function() {
            const validationResult = RentalAgreement.checkDate(formEl.start.value);
            formEl.start.setCustomValidity(validationResult.message);
        });
        formEl.end.addEventListener("input", function() {
            const validationResult = RentalAgreement.checkDate(formEl.end.value);
            formEl.end.setCustomValidity(validationResult.message);
        });
        formEl.price.addEventListener("input", function() {
            const validationResult = RentalAgreement.checkPrice(formEl.price.value);
            formEl.price.setCustomValidity(validationResult.message);
        });

        // set an event handler for the submit/save button
        saveButton.addEventListener("click", async function() {
            formEl.invoiceId.setCustomValidity(
                (await RentalAgreement.checkInvoiceIdAsId(formEl.invoiceId.value))
                .message
            );

            formEl.customer.setCustomValidity(
                RentalAgreement.checkCustomer(customer.customersId).message
            );

            formEl.car.setCustomValidity(
                RentalAgreement.checkCar(car.licensePlate).message
            );

            formEl.start.setCustomValidity(
                RentalAgreement.checkDate(formEl.start.value).message
            );

            formEl.end.setCustomValidity(
                RentalAgreement.checkDate(formEl.end.value).message
            );

            formEl.price.setCustomValidity(
                RentalAgreement.checkPrice(formEl.price.value).message
            );

            let year1 = formEl.start.value.slice(0, 4),
                month1 = formEl.start.value.slice(5, 7),
                day1 = formEl.start.value.slice(8, 10),
                year2 = formEl.end.value.slice(0, 4),
                month2 = formEl.end.value.slice(5, 7),
                day2 = formEl.end.value.slice(8, 10);
            const slots = {
                invoiceId: formEl.invoiceId.value,
                customer: customer.customersId,
                car: car.licensePlate,
                startDate: new Date(year1, parseInt(month1) - 1, parseInt(day1) + 1)
                    .toISOString()
                    .slice(0, 10),
                endDate: new Date(year2, parseInt(month2) - 1, parseInt(day2) + 1)
                    .toISOString()
                    .slice(0, 10),
                price: formEl.price.value,
            };
            const invoiceSlots = {
                invoice_id: formEl.invoiceId.value,
                customer: customer.customersId,
                car: car.licensePlate,
            };
            if (formEl.checkValidity()) {
                await RentalAgreement.add(slots);
                await Invoice.add(invoiceSlots);
                formEl.reset();
            }
        });
    },
};

car_rental.v.rentalAgreements.updateRentAgreement = {
    setupUserInterface: async function() {
        const formEl = document.forms["Rent-U"],
            updateButton = formEl.commit,
            selectRentEl = formEl.selectRent,
            selectCustEl = formEl.customer,
            selectCarEl = formEl.car;
        var allCustomers = await Customer.retrieveAll();
        var allCars = await Car.retrieveAll();
        let car,
            customer = "";
        // load all car records
        const rentRecords = await RentalAgreement.retrieveAll();
        for (let rentRec of rentRecords) {
            let optionEl = document.createElement("option");
            optionEl.text = rentRec.invoiceId;
            optionEl.value = rentRec.invoiceId;
            selectRentEl.add(optionEl, null);
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
        selectRentEl.addEventListener("change", async function() {
            const rentRecord = await RentalAgreement.retrieve(selectRentEl.value);
            let custRecord = await Customer.retrieve(rentRecord.customer),
                carRecord = await Car.retrieve(rentRecord.car);
            customer = custRecord.customersId;
            car = carRecord.licensePlate;

            const invoiceID = selectRentEl.value;
            if (invoiceID) {
                // retrieve up-to-date car record
                const rentRec = await RentalAgreement.retrieve(invoiceID);
                (custRecord = await Customer.retrieve(rentRec.customer)),
                (carRecord = await Car.retrieve(rentRec.car)),
                (customer = custRecord.customersId),
                (car = carRecord.licensePlate);

                formEl.invoiceId.value = rentRec.invoiceId;
                document.getElementById("custOption").textContent = custRecord.name;
                document.getElementById("carOption").textContent = carRecord.model;

                formEl.start.value = rentRec.startDate;
                formEl.end.value = rentRec.endDate;
                formEl.price.value = rentRec.price;
            } else {
                formEl.reset();
            }
        });

        formEl.customer.addEventListener("change", function() {
            const validationResult = RentalAgreement.checkCustomer(customer);
            formEl.customer.setCustomValidity(validationResult.message);
        });
        formEl.car.addEventListener("change", function() {
            const validationResult = RentalAgreement.checkCar(car);
            formEl.car.setCustomValidity(validationResult.message);
        });
        formEl.start.addEventListener("input", function() {
            const validationResult = RentalAgreement.checkDate(formEl.start.value);
            formEl.start.setCustomValidity(validationResult.message);
        });
        formEl.end.addEventListener("input", function() {
            const validationResult = RentalAgreement.checkDate(formEl.end.value);
            formEl.end.setCustomValidity(validationResult.message);
        });
        formEl.price.addEventListener("input", function() {
            const validationResult = RentalAgreement.checkPrice(formEl.price.value);
            formEl.price.setCustomValidity(validationResult.message);
        });

        // set an event handler for the submit/save button
        updateButton.addEventListener("click", async function() {
            console.log(customer);
            console.log(car);
            formEl.customer.setCustomValidity(
                RentalAgreement.checkCustomer(customer).message
            );

            formEl.car.setCustomValidity(RentalAgreement.checkCar(car).message);

            formEl.start.setCustomValidity(
                RentalAgreement.checkDate(formEl.start.value).message
            );

            formEl.end.setCustomValidity(
                RentalAgreement.checkDate(formEl.end.value).message
            );

            formEl.price.setCustomValidity(
                RentalAgreement.checkPrice(formEl.price.value).message
            );

            let year1 = formEl.start.value.slice(0, 4),
                month1 = formEl.start.value.slice(5, 7),
                day1 = formEl.start.value.slice(8, 10),
                year2 = formEl.end.value.slice(0, 4),
                month2 = formEl.end.value.slice(5, 7),
                day2 = formEl.end.value.slice(8, 10);
            // save data
            const slots = {
                invoiceId: formEl.invoiceId.value,
                customer: customer,
                car: car,
                startDate: new Date(year1, parseInt(month1) - 1, parseInt(day1) + 1)
                    .toISOString()
                    .slice(0, 10),
                endDate: new Date(year2, parseInt(month2) - 1, parseInt(day2) + 1)
                    .toISOString()
                    .slice(0, 10),
                price: formEl.price.value,
            };

            const invoiceSlots = {
                invoice_id: formEl.invoiceId.value,
                customer: customer,
                car: car,
            };

            if (formEl.checkValidity()) {
                await RentalAgreement.update(slots);
                await Invoice.update(invoiceSlots);
            }
            // update the selection list option element

            selectRentEl.options[selectRentEl.selectedIndex].text = slots.invoiceId;
            console.log(selectRentEl.options[selectRentEl.selectedIndex].text);
            formEl.reset();
        });
        // neutralize the submit event
        formEl.addEventListener("submit", function(e) {
            e.preventDefault();
        });
    },
};

car_rental.v.rentalAgreements.deleteRentAgreement = {
    setupUserInterface: async function() {
        const formEl = document.forms["Rent-D"],
            deleteButton = formEl.commit,
            selectRentEl = formEl.selectRent;
        // load all car records

        const rentRecords = await RentalAgreement.retrieveAll();
        for (let rentRec of rentRecords) {
            let optionEl = document.createElement("option");
            optionEl.text = rentRec.invoiceId;
            optionEl.value = rentRec.invoiceId;
            selectRentEl.add(optionEl, null);
        }

        // Set an event handler for the submit/delete button
        deleteButton.addEventListener(
            "click",
            car_rental.v.rentalAgreements.deleteRentAgreement
            .handleDeleteButtonClickEvent
        );
    },
    // Event handler for deleting a book
    handleDeleteButtonClickEvent: async function() {
        const selectRentEl = document.forms["Rent-D"].selectRent;
        const invoiceID = selectRentEl.value;
        if (invoiceID) {
            await RentalAgreement.destroy(invoiceID);
            await Invoice.destroy(invoiceID);
            // remove deleted book from select options
            selectRentEl.remove(selectRentEl.selectedIndex);
        }
    },
};