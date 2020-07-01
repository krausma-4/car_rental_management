car_rental.v.rentalAgreements.listAllRentAgreements = {
    setupUserInterface: async function() {
        const tableBodyEl = document.querySelector("table#rents>tbody");

        var rentRecords = await RentalAgreement.retrieveAll();

        for (let rentRec of rentRecords) {

            let row = tableBodyEl.insertRow();
            row.insertCell(-1).textContent = rentRec.invoiceId;
            row.insertCell(-1).textContent = rentRec.customer.name;
            row.insertCell(-1).textContent = rentRec.car.model;
            row.insertCell(-1).textContent = rentRec.startDate;
            row.insertCell(-1).textContent = rentRec.endDate;
            row.insertCell(-1).textContent = rentRec.price;
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
                if (carRec.licensePlate === selectCustEl.value) {
                    car = carRec;
                }
            }
        });

        // set an event handler for the submit/save button
        saveButton.addEventListener("click", async function() {

            //await db.collection("cars").doc(selectCarEl.value).get().data()
            const slots = {
                invoiceId: formEl.invoiceId.value,
                customer: customer,
                car: {},
                startDate: formEl.start.value,
                endDate: formEl.end.value,
                price: formEl.price.value,
            };
            alert("I am creatting now");
            await RentalAgreement.add(slots);
            formEl.reset();
        });
    },

};

car_rental.v.rentalAgreements.updateRentAgreement = {
    setupUserInterface: async function() {},
};

car_rental.v.rentalAgreements.deleteRentAgreement = {
    setupUserInterface: async function() {},
};