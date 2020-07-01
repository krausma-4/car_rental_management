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
        // set an event handler for the submit/save button
        saveButton.addEventListener(
            "click",
            car_rental.v.customers.createCustomer.handleSaveButtonClickEvent
        );
    },
    // save user input data
    handleSaveButtonClickEvent: async function() {
        const formEl = document.forms["Cust-C"];
        const slots = {
            customersId: formEl.customersId.value,
            name: formEl.name.value,
            surname: formEl.surname.value,
            dateOfBirth: formEl.birthdate.value,
            address: formEl.address.value,
        };
        alert("I am creatting now");
        await Customer.add(slots);
        formEl.reset();
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
                console.log(formEl);
                formEl.customersId.value = custRec.customersId;
                formEl.name.value = custRec.name;
                formEl.surname.value = custRec.surname;
                formEl.birthdate.value = custRec.dateOfBirth;
                formEl.address.value = custRec.address;
            } else {
                formEl.reset();
            }
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
        const slots = {
            customersId: formEl.customersId.value,
            name: formEl.name.value,
            surname: formEl.surname.value,
            dateOfBirth: formEl.birthdate.value,
            address: formEl.address.value,
        };
        await Customer.update(slots);
        // update the selection list option element
        selectCustEl.options[selectCustEl.selectedIndex].text = slots.title;
        formEl.reset();
    },
};

car_rental.v.customers.deleteCustomer = {
    setupUserInterface: async function() {
        const formEl = document.forms["Cust-D"],
            deleteButton = formEl.commit,
            selectCustEl = formEl.selectCustomer;
        // load all car records

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
        if (customerID) {
            await Customer.destroy(customerID);
            // remove deleted book from select options
            selectCustEl.remove(selectCustEl.selectedIndex);
        }
    },
};