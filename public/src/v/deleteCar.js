  /**********************************************
   * Delete one Car
  **********************************************/
  pl.v.deleteCar = {
    setupUserInterface: async function () {
      const formEl = document.forms["Car"],
          deleteButton = formEl.commit,
          selectCarEl = formEl.selectCar;
      // load all car records
      const carRecords = await Car.retrieveAll();
      for (let carRec of carRecords) {
        let optionEl = document.createElement("option");
        optionEl.text = carRec.licensePlate;
        optionEl.value = carRec.licensePlate;
        selectCarEl.add( optionEl, null);
      }
       // Set an event handler for the submit/delete button
    deleteButton.addEventListener("click",
    pl.v.deleteCar.handleDeleteButtonClickEvent);
  },
  // Event handler for deleting a book
  handleDeleteButtonClickEvent: async function () {
    const selectCarEl = document.forms["Car"].selectCar;
    const licensePlate = selectCarEl.value;
    if (licensePlate) {
      await Car.destroy( licensePlate);
      // remove deleted book from select options
      selectCarEl.remove( selectCarEl.selectedIndex);
    }
  }
}