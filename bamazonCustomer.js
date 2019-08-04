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
    console.log("connected as ID " + connection.threadId);
    afterConnection();
});

var table = new Table({
    head: ['ID', "Product Name", "Department", "Price", "Stock Quantity"],
    colWidths: [10, 20, 20, 10, 10]
});

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department, res[i].price, res[i].stock_quantity]
            )
        }
        console.log(table.toString());
        connection.end();
        startSale();
    });
}

function startSale() {
    inquirer.prompt([
        {
            name: "purchase",
            type: "input",
            message: "What is the ID of the item you would like to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "amount",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then (function(answer) {
        // console.log("Answer for product ID: " + answer.purchase);
        // console.log("Answer for amount: " + answer.amount);

    })
}