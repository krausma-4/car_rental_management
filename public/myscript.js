// initialize Firestore database
const db = firebase.firestore();

// list all book records of the collection "books"
let ulEl = document.getElementById("myList");
db.collection("cars").get().then( function (cars) {
  cars.forEach( function (car) {
    let c = car.data();
    let liEl = document.createElement("li");
    liEl.innerHTML += c.licensePlate + " | " + c.manufacturer + " | " + c.model;
    ulEl.appendChild( liEl);
  });
  console.log("All books' listed");
}).catch(function( error) {
  console.error("Error retrieving book records: ", error);
})
