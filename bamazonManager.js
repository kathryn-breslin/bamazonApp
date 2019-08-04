var mysql = require('mysql');
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "PileatedWoodpecker",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as ID " + connection.threadId);
    afterConnection();
});

var table = new Table({
    head: ['ID', "Product Name", "Department", "Price", "Stock Quantity"],
    colWidths: [10, 20, 20, 10, 10]
});

function afterConnection() {
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "Select an option to proceed..",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
    })
        .then(function (answer) {
            if (answer.options === "View Products for Sale") {
                viewProducts();
            }
            else if (answer.options === "View Low Inventory") {
                lowInventory();
            }
            else if (answer.options === "Add to Inventory") {
                addInventory();
            }
            else if (answer.options === "Add New Product") {
                addProduct();
            }
            else {
                console.log("Exiting the system.")
                connection.end();
            }
        });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department, res[i].price, res[i].stock_quantity]
            )
        }
        console.log("");
        console.log(table.toString());
        console.log("");

    })
    console.log("");
    console.log("What would you like to do next?");
    console.log("");
    afterConnection();
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        // console.log(res);

        if (res.length >= 1) {
            for (var i = 0; i < res.length; i++) {
                table.push(
                    [res[i].id, res[i].product_name, res[i].department, res[i].price, res[i].stock_quantity]
                )
            }
            console.log(table.toString());
        }
        else {
            console.log("");
            console.log("");
            console.log("There is no inventory that has fewer than 5 in stock quantity.");
            console.log("");
            console.log("");
        }
    })
    console.log("");
    console.log("What would you like to do next?");
    console.log("");
    afterConnection();
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "productChoice",
                type: "rawlist",
                choices: function () {
                    var choices = [];
                    for (var i = 0; i < res.length; i++) {
                        choices.push(res[i].product_name)
                    }
                    return choices;
                },
                message: "What product would you like to update?"
            },
            {
                name: "inventoryAmount",
                type: "input",
                message: "How many units would you like to add to this product's inventory?"
            }
        ]).then(function (answer) {
            var chosenProduct;

            // console.log(answer.inventoryAmount)
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === answer.productChoice) {
                    chosenProduct = res[i].product_name;

                    var newTotal = res[i].stock_quantity + parseInt(answer.inventoryAmount);
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newTotal
                            },
                            {
                                product_name: chosenProduct
                            }
                        ],
                        function (error) {
                            if (error) throw error;
                            console.log("");
                            console.log("You have added " + answer.inventoryAmount + " units to " + chosenProduct + ".");
                            console.log("The new total inventory for " + chosenProduct + " is " + newTotal + ".");
                            console.log("");
                            console.log("");
                            console.log("What would you like to do next?");
                            console.log("");
                            afterConnection();
                        }
                    )
                }
            }
        })
    })
}

function addProduct() {

        inquirer.prompt([
            {
                name: "product",
                type: "input",
                message: "Please input the name of the Product you would like to add."
            },
            {
                name: "department",
                type: "input",
                message: "In which department will this product be stored?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the cost of this product?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How much of this product would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: answer.product,
                    department: answer.department,
                    price: answer.price || 0,
                    stock_quantity: answer.quantity || 0
                },
                function (err) {
                    if (err) throw err;
                    console.log("");
                    console.log("Your " + answer.product + " has been added to Bamazon's inventory list.");
                    console.log("Bamazon now has " + answer.quantity + " units of the " + answer.product + " in our database.")
                    console.log("");
                    console.log("");
                    console.log("What would you like to do next?");
                    console.log("");
                    afterConnection();
                })
        })
}
