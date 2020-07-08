car_rental.v.cars.listAllCars = {
    setupUserInterface: async function() {
        const tableBodyEl = document.querySelector("table#cars>tbody");

        var carRecords = await Car.retrieveAll();

        for (let carRec of carRecords) {
            let row = tableBodyEl.insertRow();
            row.insertCell(-1).textContent = carRec.licensePlate;
            row.insertCell(-1).textContent = carRec.manufacturer;
            row.insertCell(-1).textContent = carRec.model;
            row.insertCell(-1).textContent = carRec.damages;
        }
    },
};

car_rental.v.cars.createCar = {
    setupUserInterface: function() {
        const saveButton = document.forms["Cars-C"].commit;
        const formEl = document.forms["Cars-C"];
        // set an event handler for the submit/save button

        formEl.licensePlate.addEventListener("input", async function() {
            const validationResult = await Car.checkLicensePlateAsId(
                formEl.licensePlate.value
            );
            formEl.licensePlate.setCustomValidity(validationResult.message);
        });
        formEl.manufacturer.addEventListener("input", async function() {
            const validationResult = Car.checkManufacturer(formEl.manufacturer.value);
            formEl.manufacturer.setCustomValidity(validationResult.message);
        });
        formEl.model.addEventListener("input", function() {
            const validationResult = Car.checkModel(formEl.model.value);
            formEl.model.setCustomValidity(validationResult.message);
        });
        formEl.damages.addEventListener("input", function() {
            const validationResult = Car.checkDamages(formEl.damages.value);
            formEl.damages.setCustomValidity(validationResult.message);
        });

        saveButton.addEventListener(
            "click",
            car_rental.v.cars.createCar.handleSaveButtonClickEvent
        );
    },
    // save user input data
    handleSaveButtonClickEvent: async function() {
        const formEl = document.forms["Cars-C"];

        formEl.licensePlate.setCustomValidity(
            (await Car.checkLicensePlateAsId(formEl.licensePlate.value)).message
        );

        formEl.manufacturer.setCustomValidity(
            Car.checkManufacturer(formEl.manufacturer.value).message
        );

        formEl.model.setCustomValidity(Car.checkModel(formEl.model.value).message);

        formEl.damages.setCustomValidity(
            Car.checkDamages(formEl.damages.value).message
        );

        const slots = {
            licensePlate: formEl.licensePlate.value,
            manufacturer: formEl.manufacturer.value,
            model: formEl.model.value,
            damages: formEl.damages.value,
        };
        if (formEl.checkValidity()) {
            await Car.add(slots);
            formEl.reset();
        }
    },
};

car_rental.v.cars.updateCar = {
    setupUserInterface: async function() {
        const formEl = document.forms["Car-U"],
            updateButton = formEl.commit,
            selectCarEl = formEl.selectCar;
        // load all car records
        const carRecords = await Car.retrieveAll();
        for (let carRec of carRecords) {
            let optionEl = document.createElement("option");
            optionEl.text = carRec.licensePlate;
            optionEl.value = carRec.licensePlate;
            selectCarEl.add(optionEl, null);
        }
        // when a car is selected, fill the form with its data
        selectCarEl.addEventListener("change", async function() {
            const licensePlate = selectCarEl.value;
            if (licensePlate) {
                // retrieve up-to-date car record
                const carRec = await Car.retrieve(licensePlate);
                console.log(formEl);
                formEl.licensePlate.value = carRec.licensePlate;
                formEl.manufacturer.value = carRec.manufacturer;
                formEl.model.value = carRec.model;
                formEl.damages.value = carRec.damages;
            } else {
                formEl.reset();
            }
        });


        formEl.manufacturer.addEventListener("input", async function() {
            const validationResult = Car.checkManufacturer(formEl.manufacturer.value);
            formEl.manufacturer.setCustomValidity(validationResult.message);
        });
        formEl.model.addEventListener("input", function() {
            const validationResult = Car.checkModel(formEl.model.value);
            formEl.model.setCustomValidity(validationResult.message);
        });
        formEl.damages.addEventListener("input", function() {
            const validationResult = Car.checkDamages(formEl.damages.value);
            formEl.damages.setCustomValidity(validationResult.message);
        });
        // set an event handler for the submit/save button
        updateButton.addEventListener(
            "click",
            car_rental.v.cars.updateCar.handleSaveButtonClickEvent
        );
        // neutralize the submit event
        formEl.addEventListener("submit", function(e) {
            e.preventDefault();
        });
    },
    // save data
    handleSaveButtonClickEvent: async function() {
        const formEl = document.forms["Car-U"],
            selectCarEl = formEl.selectCar;



        formEl.manufacturer.setCustomValidity(
            Car.checkManufacturer(formEl.manufacturer.value).message
        );

        formEl.model.setCustomValidity(Car.checkModel(formEl.model.value).message);

        formEl.damages.setCustomValidity(
            Car.checkDamages(formEl.damages.value).message
        );

        const slots = {
            licensePlate: formEl.licensePlate.value,
            manufacturer: formEl.manufacturer.value,
            model: formEl.model.value,
            damages: formEl.damages.value,
        };
        if (formEl.checkValidity()) {
            await Car.update(slots);
            // update the selection list option element
            selectCarEl.options[selectCarEl.selectedIndex].text = slots.licensePlate;
            formEl.reset();
        }
    },
};
car_rental.v.cars.deleteCar = {
    setupUserInterface: async function() {
        const formEl = document.forms["Car-D"],
            deleteButton = formEl.commit,
            selectCarEl = formEl.selectCar;
        // load all car records

        const carRecords = await Car.retrieveAll();
        for (let carRec of carRecords) {
            let optionEl = document.createElement("option");
            optionEl.text = carRec.licensePlate;
            optionEl.value = carRec.licensePlate;
            selectCarEl.add(optionEl, null);
        }

        // Set an event handler for the submit/delete button
        deleteButton.addEventListener(
            "click",
            car_rental.v.cars.deleteCar.handleDeleteButtonClickEvent
        );
    },
    // Event handler for deleting a book
    handleDeleteButtonClickEvent: async function() {
        const selectCarEl = document.forms["Car-D"].selectCar;
        const licensePlate = selectCarEl.value;
        if (licensePlate) {
            await Car.destroy(licensePlate);
            // remove deleted book from select options
            selectCarEl.remove(selectCarEl.selectedIndex);
        }
    },
};