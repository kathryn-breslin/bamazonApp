# bamazonApp

#### An online marketplace through which you can purchase products as a Customer, update the database as a Manager and view total sales as a Supervisor.

## Technologies
- Node
- MySQL
- MySQL Workbench
- Inquirer
- CLI - Table NPM

## About
This application is an Amazone-like storefront built with MySQL. Bamazon takes in orders from customers and depletes stock from the store's inventory. This application has three (3) distinct viewpoints: 1. Customer View, 2. Manager View and 3. Supervisor View.

1. The **Customer View** presents the various products that can be purchased. 
The customer views the ID Number, the Name of the Product and the Price. This application's MySQL database has a record of more associated information per product.

If the Customer wants to move an item into their shoppong cart, they are presented with two (2) prompts:
- What is the ID of the product you would like to purchase?
- How many units of the product would you like to purchase?

Once the customer has placed the order, this application checks the store's inventory. If there is not enough inventory, the customer will be alerted and asked if they would like to continue shopping for another product. If there is enough inventory, the order will be fulfilled. The database updates with the remaining quantity after purchase and the customer is shown the cost of their total purchase.

2. The **Manager View** presents a list of Menu options:
- View Products for Sale
- View Low Inventory
- Add to Inventory
- Add New Product

If the manager selects View Products for Sale, the app lists every available item with its associated Item ID, Name, Price and Quantity.

If the Manager selects View Inventory, the app lists all items with an inventory count lower than five (5).

If the manager selects Add to Inventory, the app displays a prompt that enables the manager to add more of any item currently in the store.

If the manager selects Add New Product, the app allows the manager to add a completely new product to the store.

The **Supervisor View** presents a list of Menu options: 
- View Product Sales by Department
- Create New Department

If the Supervisor selects the View Product Sales by Department, a query to the database returns the Total Profits for each department in the database.

If the Supervisor selects Create New Department, the Supervisor responds to a series of questions that is then used to create a new department with specific overhead costs to database.

This application was built using **Node.js**, **MySQL** and **Inquirer NPM packages**.

## Author
Kathryn Breslin