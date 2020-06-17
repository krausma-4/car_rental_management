// initialize Firestore database
const db = firebase.firestore();

db.collection("cars").add( {
    licensePlate: 1111,
    manufacturer: "Audi",
    model: "A6 Avant",
    damages:["", "", "", "", "",]
     })
    .then(function(carRef) {
      console.log("Car written");
    })
    .catch(function(error) {
      console.error("Error adding car: ", error);
});

// list all car records of the collection "cars"
let ulEl = document.getElementById("myList");
db.collection("cars").get().then( function (cars) {
  cars.forEach( function (car) {
    let c = car.data();
    let liEl = document.createElement("li");
    liEl.innerHTML += c.licensePlate + " | " + c.manufacturer + " | " + c.model;
    ulEl.appendChild( liEl);
  });
  console.log("All cars listed");
}).catch(function( error) {
  console.error("Error retrieving car records: ", error);
})
