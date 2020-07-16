#  https://webapp2020-f329f.web.app/

# Car Rental Management Software for "Rent a Car"(management.rent-a-car.de)

# Description
Our company rents particularly high-quality cars for a special target group to customers. A client can choose between three cars and rent a car for at least one hour. For this purpose, the customer can make a request through different channels (email, website, WhatsApp...). Shuttle services such as airport <-> hotel are also offered. Our customers can be both private individuals and companies.

# Purpose of the app

The application should enable us to organize our customers, cars, invoices and rental contracts. By organize we mean create, edit, view and delete.
A customer has the usual master data like name, surname, date of birth, address. A car has a manufacturer, a model, license plate and possible damages. A rental agreement has the following information: The customer with whom the rental agreement is concluded, a start and end date, a price, and which car is rented. An invoice is issued after a service has been rendered. After a rental agreement has been created, an invoice should also be created. 

# Information management tasks
1. organize customers
  1) Create new customer
  2) Edit customers
  3) Show customer details
  4) Delete customers
  5) List all customers
2. organize cars
  1) Create new car
  2) Edit car Information
  3) Show car details
  4) car delete
  5) List all cars
3. organize rental contracts
  1) Create a new rental contract
  2) Edit rental contract
  3) Display contract
  4) List all rental contract
4. organise invoices
  1) Create invoice
  2) Display all invoices

# Elaborated Requirements

|original customers' requirements|improved requirements|
|:------------------------------:|:-------------------:|
|1. organize customers           | |
|1.1. create new customer        |<ul><li>customer_id as an unique number</li><li>name not empty text</li><li>surname not empty text</li><li>dateOfBirth in digits form</li><li>address not empty</li></ul> |
|1.2. edit customers             |<ul><li>name not empty text</li><li>surname not empty text</li><li>address not empty text</li></ul>|
|1.3. show customer details      |<ul><li>customer_id</li><li>name</li><li>surname</li><li>dateOfBirth</li><li>address</li></ul> |
|1.4. delete customers           | |
|1.5. list all customers         |<ul><li>customer_id</li><li>name</li><li>surname</li></ul> |
|2. organize cars                | |
|2.1. create new car             |<ul><li>license plate as unique text/number</li><li>manufacturer as non-empty text to be inserted</li><li>model as non-empty text to be inserted</li><li>damages as non-empty text to be inserted</li></ul>|
|2.2. edit car information       |<ul><li>manufacturer as non-empty text to be inserted</li><li>model as non-empty text to be inserted</li><li>damages as non-empty text to be inserted</li></ul>|
|2.3. show car details           |<ul><li>license plate</li><li>manufacturer</li><li>model</li><li>damages</li></ul>|
|2.4. delete car                 | |
|2.5. list all cars              |<ul><li>license plate</li><li>model</li></ul>|
|3. organize rental contract     | |
|3.1. create new rental contract |<ul><li>invoice_id as unique number</li><li>customer as customer with all its data</li><li>car as car with all its data</li><li>startDate in digit form</li><li>endDate in digit form</li><li>price in digit form</li></ul>|
|3.2. edit rental contract       |<ul><li>startDate in digit form</li><li>endDate in digit form</li><li>price in digit form</li></ul>|
|3.3. display contract           |<ul><li>invoice_id</li><li>customer</li><li>car</li><li>startDate</li><li>endDate</li><li>price</li></ul>|
|3.4. list all contracts         |<ul><li>invoice_id</li><li>customer</li><li>car</li></ul> (customer and car are only displayed by their name/model)|
|4. organize invoices            | |
|4.1. create invoice             |<ul><li>invoice_id as a unuque number after creating a rental agreement</ul></li>|
|4.2. display all invoices       |<ul><li>same as displaying all rental contracts with invoice_id, customer, car (where customer and car are defined only with names and models)</li></ul>|

# Domain Information Model

![Domain_Information_Model](https://github.com/krausma-4/car_rental_management/blob/master/Domain_Information_Model.png)

# Design Model

![Design-Model](https://github.com/krausma-4/car_rental_management/blob/master/designModel%20(1).png)



# Task management

|tasks|provider|
|:------------------------------:|:-------------------:|
| creating firebase project |<li>Gabriel</li>  |
| Structure of all folders and files | <li>Eleonora</li>|
| validation Constraints |<li>Gabriel</li><li>Eleonora</li>  |
| implementation of m- classes |<li>Gabriel</li><li>Eleonora</li>  |
| implementation of v- classes |<li>Gabriel</li><li>Eleonora</li>  |
| implementation of authentication part |<li>Eleonora</li>  |
| bug fixes |<li>Gabriel</li><li>Eleonora</li>  |
