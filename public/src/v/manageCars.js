car_rental.v.cars.listAllCars = {
  setupUserInterface: async function () {
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
  setupUserInterface: function () {
    const saveButton = document.forms["Cars-C"].commit;
    // set an event handler for the submit/save button
    saveButton.addEventListener(
      "click",
      car_rental.v.cars.createCar.handleSaveButtonClickEvent
    );
  },
  // save user input data
  handleSaveButtonClickEvent: async function () {
    const formEl = document.forms["Cars-C"];
    const slots = {
      licensePlate: formEl.licensePlate.value,
      manufacturer: formEl.manufacturer.value,
      model: formEl.model.value,
      damages: formEl.damages.value,
    };
    alert("I am creatting now");
    await Car.add(slots);
    formEl.reset();
  },
};

car_rental.v.cars.updateCar = {
  setupUserInterface: async function () {
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
    selectCarEl.addEventListener("change", async function () {
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
    // set an event handler for the submit/save button
    updateButton.addEventListener(
      "click",
      car_rental.v.cars.updateCar.handleSaveButtonClickEvent
    );
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  },
  // save data
  handleSaveButtonClickEvent: async function () {
    const formEl = document.forms["Car-U"],
      selectCarEl = formEl.selectCar;
    const slots = {
      licensePlate: formEl.licensePlate.value,
      manufacturer: formEl.manufacturer.value,
      model: formEl.model.value,
      damages: formEl.damages.value,
    };
    await Car.update(slots);
    // update the selection list option element
    selectCarEl.options[selectCarEl.selectedIndex].text = slots.title;
    formEl.reset();
  },
};
car_rental.v.cars.deleteCar = {
  setupUserInterface: async function () {
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
  handleDeleteButtonClickEvent: async function () {
    const selectCarEl = document.forms["Car-D"].selectCar;
    const licensePlate = selectCarEl.value;
    if (licensePlate) {
      await Car.destroy(licensePlate);
      // remove deleted book from select options
      selectCarEl.remove(selectCarEl.selectedIndex);
    }
  },
};
