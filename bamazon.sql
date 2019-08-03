DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products(
    item_id INT(33) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(33),
    price INT(11) NOT NULL,
    stock_quantity INT(11) NOT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products(product_name,department_name,price,stock_quantity)
values 
('Generic toothbrush','Dental',2.99,200),
('Generic Buzzsaw','Home Improvement',63.45,10),
('Generic Baseball Bat','Sports and Outdoors', 9.99,20),
('Generic Fake Blood','Props and Costumes',7.50,5),
('Cast Iron Skillet','Cooking',20,50),
('Tennis balls','Sports and Outdoors',2.99,50),
('Premium Floss','Dental',5,15),
('Assorted Signs','Astrology and Crafts',10,3),
('Balloons of Falling','Normal Crafts',11,5),
('Bag of Ideas','Home Improvement',99.99,2);

