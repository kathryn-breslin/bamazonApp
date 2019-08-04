var mysql = require('mysql');
var inquirer = require("inquirer");
var Table = require("cli-table");
var total = 0;

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
        startSale();
    });
}

function startSale() {
    inquirer.prompt([
        {
            name: "id",
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
        // console.log("Answer for product ID: " + answer.id);
        // console.log("Answer for amount: " + answer.amount);
        connection.query("SELECT * FROM products WHERE ?", { id: answer.id }, function (err, res) { 
            if (err) throw err;
            // console.log(res)

            if (res[0].stock_quantity >= answer.amount) {
                total = total + (answer.amount * res[0].price);
                console.log("Your Total: $" + total);
                console.log("You added " + answer.amount + " " + res[0].product_name + " in your cart!");

                var stockQuantity = res[0].stock_quantity - answer.amount;
                var productSales = res[0].price * answer.amount;
                // console.log("Total product sales: " + productSales)
                // console.log("Stock Quantity: " + stockQuantity);
                connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE id = ?", 
                    [stockQuantity, productSales, answer.id], function (err, res) { 
                    }
                )
                inquirer.prompt(
                    {
                        name: "nextStep", 
                        type: "list", 
                        message: "Would you like to continue shopping?",
                        choices: ["YES", "NO"]
                    }
                ).then(function(answer) {
                    if (answer.nextStep === "YES"){
                        // connection.end();
                        startSale();
                    }
                    else if (answer.nextStep === "NO"){
                        connection.end();
                        console.log("Thank you for shopping with us today.")
                        console.log("Your total is $" + total)
                    }
                })
            }
            else {
                console.log("Insufficient Quantity! Please select another Item");
                connection.end();
                startSale();
            }
            
        })

    })
}