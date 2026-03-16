CREATE DATABASE docker_orders;

\c docker_orders

CREATE TABLE IF NOT EXISTS orders(
                                     id SERIAL PRIMARY KEY,
                                     user_id int,
                                     product_id int,
                                     quantity int,
                                     total_price numeric,
                                     status varchar(100) DEFAULT 'Preparing',
                                     created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

INSERT INTO orders(user_id, product_id, quantity, total_price) VALUES (1,2,100, 150.99);