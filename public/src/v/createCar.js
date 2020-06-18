
  /**********************************************
   * Create a new Car
  **********************************************/
  pl.v.createCar = {
    setupUserInterface: function () {
      const saveButton = document.forms['Car'].commit;
      // set an event handler for the submit/save button
      saveButton.addEventListener("click",
        pl.v.createCar.handleSaveButtonClickEvent);
    },
  // save user input data
  handleSaveButtonClickEvent: async function () {
    const formEl = document.forms['Car'];
    const slots = {
      licensePlate: formEl.licensePlate.value,
      manufacturer: formEl.manufacturer.value,
      model: formEl.model.value,
      damages: formEl.damages.value
    };
    await Car.add( slots);
    formEl.reset();
  }
}