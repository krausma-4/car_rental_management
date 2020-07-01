
  /**********************************************
   * Create a new Car
  **********************************************/
  pl.v.createCar = {
    setupUserInterface: function () {
      const formEl = document.forms['Car'],
        saveButton = formEl.commit;
      
      // add event listeners for responsive validation
      formEl.licensePlate.addEventListener("input", function () {
        // do not yet check the ID constraint, only before commit
        formEl.licensePlate.setCustomValidity(
          Car.checkLicensePlate( formEl.licensePlate.value).message);
      });
      formEl.manufacturer.addEventListener("input", function () {
        formEl.manufacturer.setCustomValidity(
          Car.checkManufacturer( formEl.manufacturer.value).message);
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
      saveButton.addEventListener("click",
        pl.v.createCar.handleSaveButtonClickEvent);
      // neutralize the submit event
      formEl.addEventListener( 'submit', function (e) {
        e.preventDefault();
      });
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

    formEl.licensePlate.setCustomValidity( (await Car.checkLicensePlateAsId( slots.licensePlate)).message);
    formEl.manufacturer.setCustomValidity( Car.checkManufacturer( slots.manufacturer).message);
    formEl.model.setCustomValidity( Car.checkModel( slots.model).message);
    if (formEl.damages.value) {
      formEl.damages.setCustomValidity( Car.checkDamages( slots.damages).message);
    }
    if (formEl.checkValidity())
      try {
        await Car.add( slots);
        formEl.reset();
      } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`)
      }
  }
}