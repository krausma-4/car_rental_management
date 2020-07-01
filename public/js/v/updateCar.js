  /**********************************************
   * Update any Car
  **********************************************/
  pl.v.updateCar = {
    setupUserInterface: async function () {
      const formEl = document.forms["Car"],
          updateButton = formEl.commit,
          selectCarEl = formEl.selectCar;
      // load all car records
      const carRecords = await Car.retrieveAll();
      for (let carRec of carRecords) {
        let optionEl = document.createElement("option");
        optionEl.text = carRec.licensePlate;
        optionEl.value = carRec.licensePlate;
        selectCarEl.add( optionEl, null);
      }
      // when a car is selected, fill the form with its data
    selectCarEl.addEventListener("change", async function () {
      const licensePlate = selectCarEl.value;
      if (licensePlate) {
        // retrieve up-to-date car record
        const carRec = await Car.retrieve( licensePlate);
        formEl.licensePlate.value = carRec.licensePlate;
        formEl.manufacturer.value = carRec.manufacturer;
        formEl.model.value = carRec.model;
        formEl.damages.value = carRec.damages;
      } else {
        formEl.reset();
      }
    });

    // add event listeners for responsive validation
    formEl.manufacturer.addEventListener("input", function () {
      formEl.manufacturer.setCustomValidity(
        Car.checkManufacturer( formEl.title.manufacturer).message);
    });
    formEl.model.addEventListener("input", function () {
      formEl.model.setCustomValidity(
        Car.checkModel( formEl.model.value).message);
    });
    formEl.damages.addEventListener("input", function () {
      formEl.damages.setCustomValidity(
        Car.checkDamages( formEl.damages.value).message);
    });
    // set an event handler for the submit/save button
    updateButton.addEventListener("click",
      pl.v.updateCar.handleSaveButtonClickEvent);
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  },
  // save data
  handleSaveButtonClickEvent: async function () {
    const formEl = document.forms['Car'],
      selectCarEl = formEl.selectCar;
    const slots = {
      licensePlate: formEl.licensePlate.value,
      manufacturer: formEl.manufacturer.value,
      model: formEl.model.value,
      damages: formEl.damages.value
    };
    // set error messages in case of constraint violations
    formEl.manufacturer.setCustomValidity( Car.checkManufacturer( slots.manufacturer).message);
    formEl.model.setCustomValidity( Book.checkModel( slots.model).message);
    formEl.damages.setCustomValidity( Book.checkDamages( slots.damages).message);

    if (formEl.checkValidity()) {
      try{
        await Car.update(slots);
        // update the selection list option element
        selectCarEl.options[selectCarEl.selectedIndex].text = slots.title;
        formEl.reset();
      } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`)
      }
    }
  }
};
