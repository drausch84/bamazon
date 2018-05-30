DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
item_id INT(40) NOT NULL AUTO_INCREMENT,
product_name VARCHAR(40) NOT NULL,
department_name VARCHAR(40) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT(40) NOT NULL,
PRIMARY KEY(item_id)
);



INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Samsung 62' Flatscreen TV", "Electronics", 1499.50, 30),
	   ("Playstation 4 System", "Electronics", 399.50, 60),
	   ("Tea Tree Mint Lavender Shampoo", "Health/Beauty", 49.99, 17),
	   ("St. Ives Apricot Scrub", "Health/Beauty", 3.67, 120),
	   ("Stephen King's 'IT'", "Books", 8.99, 10),
	   ("John Deere PushMower", "Garden", 179.89, 35),
	   ("Kibbles and Bits Dog Food", "Pet", 4.99, 12),
	   ("Maybeline Concealer", "Health/Beauty", 7.99, 2),
	   ("Soft Lips chapstick", "Health/Beauty", 1.99, 18),
	   ("Sony Blue Ray DVD Player", "Electronics", 69.99, 19);

       SELECT * FROM products