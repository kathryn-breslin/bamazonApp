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

function afterConnection() {
    inquirer.prompt(
        {
            name: "supervisorQuestions",
            type: "list",
            message: "Please select an option to continue.",
            choices: ["View Product Sales by Department", "Create New Department", "EXIT"]
        }
    ).then(function (answer) {
        if (answer.supervisorQuestions === "View Product Sales by Department") {
            showSales();
        }
        else if (answer.supervisorQuestions === "Create New Department") {
            createDepartment();
        }
        else {
            console.log("Exiting the system.");
            connection.end();
        }
    })
}

var table = new Table({
    head: ['Department ID', "Department Name", "Overhead Costs", "Product Sales", "Total Profit"],
    colWidths: [10, 20, 20, 10, 10]
});

function showSales() {
    connection.query("SELECT departments.department_id, departments.department, departments.over_head_costs, SUM(products.product_sales) as product_sales, SUM(products.product_sales) - departments.over_head_costs as total_profit FROM products INNER JOIN departments ON products.department = departments.department GROUP BY departments.department_id, departments.department, departments.over_head_costs", function (err, res) {
        if (err) throw err;
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].department_id, res[i].department, res[i].over_head_costs, res[i].product_sales, res[i].total_profit])
        }
        console.log("")
        console.log(table.toString());
        console.log("")
        console.log("")
        afterConnection();
    });
}

function createDepartment() {
    inquirer.prompt([
        {
            name: "newDepartment",
            type: "input",
            message: "What is the name of the Department you would like to create?"
        },
        {
            name: "newOverhead",
            type: "input",
            message: "What is the overhead cost for this department?"
        }
    ]).then(function (answer) {
        console.log(answer.newDepartment)
        connection.query("INSERT INTO departments (department, over_head_costs) VALUES (?, ?)",
            [answer.newDepartment, answer.newOverhead],
            function (err, res) {
                if (err) throw err;
                console.log("You have now added " + answer.newDepartment + " with an Overhead cost of $" + answer.newOverhead + " to the database.")
                console.log("")
                console.log("")
                afterConnection();
            })
    })
}