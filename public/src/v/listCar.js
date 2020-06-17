
  /**********************************************
   * List all Cars
  **********************************************/
  pl.v.listCar = {
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
    }
  };
