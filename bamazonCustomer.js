// required NPMs that include inquirer for user prompt and MYSQL for the database
var inquirer = require("inquirer");
var mysql = require("mysql");

// MYSQL defined parameters
var connection = mysql.createConnection({
	host: "localhost",
	port: 8889,

	// username
	user: "root",

	//password and database
	password: "root",
	database: "bamazon"
});

var numProducts = 0;

// Connect to the bamazon database
connection.connect(function(err) {
    // throw error if there is error present
    if (err) throw err;
    // created new promise to return callbacks instead of calling for 2 callbacks in one function
    new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) reject(err);
            resolve(res);
            console.log("------------------------------------------")
            console.log("------------Welcome to Bamazon!-----------")
            console.log("------------List of Products:-------------")
        });
        // list out the available products to choose from
    }).then(function(result) {
        result.forEach(function(item) {
            numProducts++;
            console.log("Item ID: " + item.item_id + " || Product Name: " + item.product_name + " || Price: " + item.price);
        });
        // open Bamazon store
    }).then(function() {
        return start();
        
    }).catch(function(err) {
        console.log(err);
    });
});

// Function to enter the store
function start() {
    inquirer.prompt([{
        name: "entrance",
        message: "Would you like to shop with us today?",
        type: "list",
        choices: ["Yes", "No"]
    }]).then(function(answer) {
        // if yes, proceed to shop menu
        if (answer.entrance === "Yes") {
            menu();
        } else {
            // if no, end node cli  
            console.log("---------------------------------------");
            console.log("No?!?!?!  What do you mean no!?!?!?!?!?");
            console.log("---------------------------------------");
            connection.destroy();
            return;
        }
    });
}

// Function for the menu options 
function menu() {
    return inquirer.prompt([{
        name: "item",
        message: "Enter the item number of the product you would like to purchase.",
        type: "input",
        // Validator to ensure the product number is a number and it exists
        validate: function(value) {
            if ((isNaN(value) === false) && (value <= numProducts)) {
                return true;
            } else {
                console.log('\nPlease enter a valid ID.');
                return false;
            }
        }
    }, {
        name: "quantity",
        message: "How many would you like to buy?",
        type: "input",
        // Validator to ensure it is number and not a letter or symbol
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log("\nPlease enter a valid quantity.");
                return false;
            }
        }
        // new promise to pull all data from SQL
    }]).then(function(answer) {
        return new Promise(function(resolve, reject) {
            connection.query("SELECT * FROM products WHERE ?", { item_id: answer.item }, function(err, res) {
                if (err) reject(err);
                resolve(res);
            });
            // Then if selected quanitity is valid, save to a local object, else console log error
        }).then(function(result) {
            var savedData = {};

            if (parseInt(answer.quantity) <= parseInt(result[0].stock_quantity)) {
                savedData.answer = answer;
                savedData.result = result;
            } else if (parseInt(answer.quantity) > parseInt(result[0].stock_quantity)) {
                console.log("Quantity not available");
            } else {
                console.log("An error occurred, order could not be completed");
            }
            
            return savedData;
            // Update the SQL DB and console log the order total
        }).then(function(savedData) {
            if (savedData.answer) {
                var updatedQuantity = parseInt(savedData.result[0].stock_quantity) - parseInt(savedData.answer.quantity);
                var itemId = savedData.answer.item;
                var totalCost = parseFloat(savedData.result[0].price) * parseFloat(savedData.answer.quantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: updatedQuantity
                }, {
                    item_id: itemId
                }], function(err, res) {
                    if (err) throw err;
                    console.log("------------------------------------");
                    console.log("Your order total cost $" + totalCost.toFixed(2));
                    console.log("-------------------------------------");
                    connection.destroy();
                });
            } else {
                // Recursion to call upon the start function again
                start();
            }
            // catch errors
        }).catch(function(err) {
            console.log(err);
            connection.destroy();
        });
        // catch errors
    }).catch(function(err) {
        console.log(err);
        connection.destroy();
    });
}