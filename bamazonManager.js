var mysql = require('mysql');
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
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
                console.log("Add to Inventory")
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
    afterConnection();
}

function addInventory() {
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
            validate: function(value){
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
            validate: function(value){
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", 
        {
            product_name: answer.product, 
            department: answer.department, 
            price: answer.price || 0,
            stock_quantity: answer.quantity || 0
        }, 
        function(err) {
            if (err) throw err;
            console.log("");
            console.log("Your " + answer.product + " has been added to Bamazon's inventory list.");
            console.log("");
            afterConnection();
        })
    })
}