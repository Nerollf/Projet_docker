CREATE DATABASE docker_products;

\c docker_products

CREATE TABLE IF NOT EXISTS products(
                                       id SERIAL PRIMARY KEY,
                                       name varchar(255),
                                       price numeric,
                                       stock int,
                                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products(name, price, stock) VALUES ('Chaise',25.50, 50);