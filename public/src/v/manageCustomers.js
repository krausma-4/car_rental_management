car_rental.v.customers.listAllCustomers = {
    setupUserInterface: async function() {
        const tableBodyEl = document.querySelector("table#customers>tbody");

        var custRecords = await Customer.retrieveAll();

        for (let custRec of custRecords) {
            let row = tableBodyEl.insertRow();
            row.insertCell(-1).textContent = custRec.customersId;
            row.insertCell(-1).textContent = custRec.name;
            row.insertCell(-1).textContent = custRec.surname;
            row.insertCell(-1).textContent = custRec.dateOfBirth;
            row.insertCell(-1).textContent = custRec.address;
        }
    },
};

car_rental.v.customers.createCustomer = {
    setupUserInterface: async function() {
        const saveButton = document.forms["Cust-C"].commit;
        const formEl = document.forms["Cust-C"];
        formEl.customersId.addEventListener("input", async function() {
            const validationResult = await Customer.checkcustomersIdAsId(
                formEl.customersId.value
            );
            formEl.customersId.setCustomValidity(validationResult.message);
        });
        formEl.name.addEventListener("input", async function() {
            const validationResult = Customer.checkName(formEl.name.value);
            formEl.name.setCustomValidity(validationResult.message);
        });
        formEl.surname.addEventListener("input", function() {
            const validationResult = Customer.checkName(formEl.surname.value);
            formEl.surname.setCustomValidity(validationResult.message);
        });
        formEl.birthdate.addEventListener("input", function() {
            const validationResult = Customer.checkBirthday(formEl.birthdate.value);
            formEl.birthdate.setCustomValidity(validationResult.message);
        });
        formEl.address.addEventListener("input", function() {
            const validationResult = Customer.checkAddress(formEl.address.value);
            formEl.address.setCustomValidity(validationResult.message);
        });

        // set an event handler for the submit/save button
        saveButton.addEventListener(
            "click",
            car_rental.v.customers.createCustomer.handleSaveButtonClickEvent
        );
    },
    // save user input data
    handleSaveButtonClickEvent: async function() {
        const formEl = document.forms["Cust-C"];
        let year = formEl.birthdate.value.slice(0, 4),
            month = formEl.birthdate.value.slice(5, 7),
            day = formEl.birthdate.value.slice(8, 10);


        formEl.customersId.setCustomValidity(
            (await Customer.checkcustomersIdAsId(formEl.customersId.value)).message
        );

        formEl.name.setCustomValidity(
            Customer.checkName(formEl.name.value).message
        );

        formEl.surname.setCustomValidity(
            Customer.checkName(formEl.surname.value).message
        );

        formEl.birthdate.setCustomValidity(
            Customer.checkBirthday(formEl.birthdate.value).message
        );

        formEl.address.setCustomValidity(
            Customer.checkAddress(formEl.address.value).message
        );

        const slots = {
            customersId: formEl.customersId.value,
            name: formEl.name.value,
            surname: formEl.surname.value,
            dateOfBirth: new Date(year, parseInt(month) - 1, parseInt(day) + 1)
                .toISOString()
                .slice(0, 10),
            address: formEl.address.value,
        };

        if (formEl.checkValidity()) {
            await Customer.add(slots);
            formEl.reset();
        }
    },
};

car_rental.v.customers.updateCustomer = {
    setupUserInterface: async function() {
        const formEl = document.forms["Cust-U"],
            updateButton = formEl.commit,
            selectCustEl = formEl.selectCustomer;
        // load all car records
        const custRecords = await Customer.retrieveAll();
        for (let custRec of custRecords) {
            let optionEl = document.createElement("option");
            optionEl.text = custRec.customersId;
            optionEl.value = custRec.customersId;
            selectCustEl.add(optionEl, null);
        }
        // when a car is selected, fill the form with its data
        selectCustEl.addEventListener("change", async function() {
            const custId = selectCustEl.value;
            if (custId) {
                // retrieve up-to-date car record
                const custRec = await Customer.retrieve(custId);

                formEl.customersId.value = custRec.customersId;
                formEl.name.value = custRec.name;
                formEl.surname.value = custRec.surname;
                formEl.birthdate.value = custRec.dateOfBirth;
                formEl.address.value = custRec.address;
            } else {
                formEl.reset();
            }
        });


        formEl.name.addEventListener("input", function() {
            const validationResult = Customer.checkName(formEl.name.value);
            formEl.name.setCustomValidity(validationResult.message);
        });
        formEl.surname.addEventListener("input", function() {
            const validationResult = Customer.checkName(formEl.surname.value);
            formEl.surname.setCustomValidity(validationResult.message);
        });
        formEl.birthdate.addEventListener("input", function() {
            const validationResult = Customer.checkBirthday(formEl.birthdate.value);
            formEl.birthdate.setCustomValidity(validationResult.message);
        });
        formEl.address.addEventListener("input", function() {
            const validationResult = Customer.checkAddress(formEl.address.value);
            formEl.address.setCustomValidity(validationResult.message);
        });

        // set an event handler for the submit/save button
        updateButton.addEventListener(
            "click",
            car_rental.v.customers.updateCustomer.handleSaveButtonClickEvent
        );
        // neutralize the submit event
        formEl.addEventListener("submit", function(e) {
            e.preventDefault();
        });
    },
    // save data
    handleSaveButtonClickEvent: async function() {
        const formEl = document.forms["Cust-U"],
            selectCustEl = formEl.selectCustomer;
        let year = formEl.birthdate.value.slice(0, 4),
            month = formEl.birthdate.value.slice(5, 7),
            day = formEl.birthdate.value.slice(8, 10);



        formEl.name.setCustomValidity(
            Customer.checkName(formEl.name.value).message
        );

        formEl.surname.setCustomValidity(
            Customer.checkName(formEl.surname.value).message
        );

        formEl.birthdate.setCustomValidity(
            Customer.checkBirthday(formEl.birthdate.value).message
        );

        formEl.address.setCustomValidity(
            Customer.checkAddress(formEl.address.value).message
        );
        const slots = {
            customersId: formEl.customersId.value,
            name: formEl.name.value,
            surname: formEl.surname.value,
            dateOfBirth: new Date(year, parseInt(month) - 1, parseInt(day) + 1)
                .toISOString()
                .slice(0, 10),
            address: formEl.address.value,
        };
        if (formEl.checkValidity()) {
            await Customer.update(slots);
            // update the selection list option element
            selectCustEl.options[selectCustEl.selectedIndex].text = slots.customersId;
            formEl.reset();
        }
    },
};

car_rental.v.customers.deleteCustomer = {
    setupUserInterface: async function() {
        const formEl = document.forms["Cust-D"],
            deleteButton = formEl.commit,
            selectCustEl = formEl.selectCustomer;
        var allCustomers = await Customer.retrieveAll();
        // load all car records

        console.log(allCustomers);

        const custRecords = await Customer.retrieveAll();
        for (let custRec of custRecords) {
            let optionEl = document.createElement("option");
            optionEl.text = custRec.customersId;
            optionEl.value = custRec.customersId;
            selectCustEl.add(optionEl, null);
        }

        // Set an event handler for the submit/delete button
        deleteButton.addEventListener(
            "click",
            car_rental.v.customers.deleteCustomer.handleDeleteButtonClickEvent
        );
    },
    // Event handler for deleting a book
    handleDeleteButtonClickEvent: async function() {
        const selectCustEl = document.forms["Cust-D"].selectCustomer;
        const customerID = selectCustEl.value;
        console.log(customerID);
        if (customerID) {
            await Customer.destroy(customerID);
            // remove deleted book from select options
            selectCustEl.remove(selectCustEl.selectedIndex);
        }
    },
};