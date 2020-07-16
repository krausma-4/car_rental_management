const car_rental = {
    m: {},
    v: { cars: {}, customers: {}, invoice: {}, rentalAgreements: {} },
    c: { cars: {}, customers: {}, invoice: {}, rentalAgreements: {} },
};
const db = firebase.firestore();
// initialize Firebase user authentication interface
const auth = firebase.auth();

function showChosenSection(idOfElem, idofchosenSection, functionTOBeLoaded) {
    var chosenSection = document.getElementById(idOfElem);
    var agreementSection = document.getElementById(idofchosenSection);
    var optionsDiv = document.getElementById("chosenOption");

    agreementSection.style.display = "none";
    optionsDiv.style.display = "block";
    chosenSection.style.display = "block";

    functionTOBeLoaded.setupUserInterface();
}

function refreshUI(htmlFile) {
    location.href = htmlFile;
}