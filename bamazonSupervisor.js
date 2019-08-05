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
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ).then(function(answer) {
        if (answer.supervisorQuestions === "View Product Sales by Department"){
            showSales();
        }
        else {
            // createDepartment();
        }
    })
}

var table = new Table({
    head: ['Department ID', "Department Name", "Overhead Costs", "Product Sales", "Total Profit"],
    colWidths: [10, 20, 20, 10, 10]
});

function showSales() {
    connection.query("SELECT departments.department_id, departments.department, departments.over_head_costs, SUM(products.product_sales) as product_sales, SUM(products.product_sales) - departments.over_head_costs as total_profit FROM products INNER JOIN departments ON products.department = departments.department GROUP BY departments.department_id, departments.department, departments.over_head_costs", function(err, res) {
        if (err) throw err;
        console.log(res);
    });
}