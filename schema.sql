DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Rug", "Home Goods", 150, 30);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Lounge Chair", "Home Goods", 75, 10);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Trash Bin", "Home Goods", 20, 25);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Silk Dress", "Fashion", 120, 20);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Sneakers", "Fashion", 100, 35);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Headphones", "Technology", 200, 10);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Cookie Sheet", "Kitchen", 15, 45);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Coffee Machine", "Kitchen", 75, 12);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Wine Glasses", "Kitchen", 55, 10);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Kayak", "Sports", 230, 10);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Hammock", "Sports", 175, 20);