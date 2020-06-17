const car_rental = {
  cars: {},
  customers: {},
  invoice: {},
  rentalAgreements: {},
};
const db = firebase.firestore();

function showChosenSection(idOfElem, functionTOBeLoaded) {
 // movieWorld.c.initialiseLocalStorage();
  //functionTOBeLoaded;

  var chosenSection = document.getElementById(idOfElem);

  var agreementSection = document.getElementById("Car-M");
  var optionsDiv = document.getElementById("chosenOption");

  agreementSection.style.display = "none";
  optionsDiv.style.display = "block";
  chosenSection.style.display = "block";
}

function refreshUI(htmlFile){
  
location.href = htmlFile;
}