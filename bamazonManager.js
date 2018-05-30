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

// counter for number of products
var numProducts = 0;

// Connect to DB
connection.connect(function(err) {
    // throw error if one exists
    if (err) throw err;
    // created new promise to return callbacks instead of calling for 2 callbacks in one function
    new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) reject(err);
            resolve(res);
            console.log("----------------");
            console.log("Hello, valued Bamazon Manager!");
            console.log("-----------------");
        });
    }).then(function(result) {
        // increase number of products
        result.forEach(function(item) {
            numProducts++;
        });

        return managerView();
        // catch errors
    }).catch(function(err) {
        console.log(err);
    });
});

// manager view menu function
function managerView() {
    inquirer.prompt([{
        name: "entrance",
        message: "What would you like to do?",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
    }]).then(function(answer) {
        switch (answer.entrance) {
            case "View Products for Sale":
                itemsForSale();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case 'EXIT':
                console.log("----------------");
                console.log("Have a wonderful day!");
                connection.destroy();
                return;
                break;
            default:
                managerView();
                break
        };
    });
}

// shows list of all products
function logItems(result) {
    result.forEach(function(item) {
        numProducts++;
        console.log("\nItem ID: " + item.item_id + "\nProduct Name: " + item.product_name + "\nDepartment: " + item.department_name + "\nPrice: " + item.price + "\nStock: " + item.stock_quantity);
    });
}

// lists items for sale from the bamazon database
function itemsForSale() {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) reject(err);
            resolve(res);
        });
    }).then(function(result) {
        logItems(result);
    }).then(function() {
        managerView();
        // catch errors
    }).catch(function(err) {
        console.log(err);
        connection.destroy();
    });
}

// lists all items with an inventory below 20 only
function lowInventory() {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM products WHERE stock_quantity < 20", function(err, res) {
            if (err) reject(err);
            resolve(res);
        });
    }).then(function(result) {
        logItems(result);
    }).then(function() {
        managerView();
        // catch errors
    }).catch(function(err) {
        console.log(err);
        connection.destroy();
    });
}


// add inventory function
function addInventory() {
    return inquirer.prompt([{
        name: "item",
        message: "Enter the item number of the product you would like to add stock to.",
        type: "input",
        validate: function(value) {
            // ensuring number added is a valid number
            if ((isNaN(value) === false) && (value <= numProducts)) {
                return true;
            } else {
                console.log("\nPlease enter a valid item ID.");
                return false;
            }
        }
    }, {
        name: "quantity",
        message: "How much stock would you like to add?",
        type: "input",
        // ensuring number added is a valid number
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log("\nPlease enter a valid quantity.");
                return false;
            }
        }
    }]).then(function(answer) {
        return new Promise(function(resolve, reject) {
            connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: answer.item }, function(err, res) {
                if (err) reject(err);
                resolve(res);
            });
        }).then(function(result) {
            var updatedQuantity = parseInt(result[0].stock_quantity) + parseInt(answer.quantity);
            var itemId = answer.item
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: updatedQuantity
            }, {
                item_id: itemId
            }], function(err, res) {
                if (err) throw err;
                console.log("The total stock has been updated to: " + updatedQuantity);
                managerView();
            });
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

// add product function
function addProduct() {
    return inquirer.prompt([{
        name: "product",
        message: "Enter the name of the product you would like to add.",
        type: "input",
        // ensure a string value is input from the user
        validate: function(value) {
            if (value === "") {
                console.log("----------------------------");
                console.log("\nPlease enter a valid name.");
                return false;
            } else {
                return true;
            }
        }
    }, {
        name: "department",
        message: "Enter the name of the department where the product is located.",
        type: "input",
        // ensure a string value is input from the user
        validate: function(value) {
            if (value === "") {
                console.log("---------------------------------------");
                console.log("\nPlease enter a valid department name.");
                return false;
            } else {
                return true;
            }
        }
    }, {
        name: "price",
        message: "Enter the price of the product.",
        type: "input",
        // ensure a valid number is input
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log("-----------------------------");
                console.log("\nPlease enter a valid price.");
                return false;
            }
        }
    }, {
        name: "quantity",
        message: "Enter the amount of initial stock quantity.",
        type: "input",
        validate: function(value) {
            // ensure a valid number is input
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log("--------------------------------");
                console.log("\nPlease enter a valid quantity.");
                return false;
            }
        }
    }]).then(function(answer) {
        // new promise to update bamazon database with any changes made from manager options
        return new Promise(function(resolve, reject) {
            connection.query("INSERT INTO products SET ?", [{
                product_name: answer.product,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
            }], function(err, res) {
                if (err) reject(err);
                resolve(res);
            });
            // log message
        }).then(function() {
            console.log("The product has been added to the inventory.");
            managerView();
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