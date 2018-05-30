DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
item_id INT(40) NOT NULL,
product_name VARCHAR(40) NOT NULL,
department_name VARCHAR(40) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT(40) NOT NULL,
PRIMARY KEY(item_id)
);



INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (1, "Samsung 62' Flatscreen TV", "Electronics", 1499.50, 30),
	   (2, "Playstation 4 System", "Electronics", 399.50, 60),
	   (3, "Tea Tree Mint Lavender Shampoo", "Health/Beauty", 49.99, 100),
	   (4, "St. Ives Apricot Scrub", "Health/Beauty", 3.67, 200),
	   (5, "Stephen King's 'IT'", "Books", 8.99, 100),
	   (6, "John Deere PushMower", "Garden", 179.89, 65),
	   (7, "Kibbles and Bits Dog Food", "Pet", 4.99, 62),
	   (8, "Maybeline Concealer", "Health/Beauty", 7.99, 22),
	   (9, "Soft Lips chapstick", "Health/Beauty", 1.99, 18),
	   (10, "Sony Blue Ray DVD Player", "Electronics", 69.99, 9);

       SELECT * FROM products