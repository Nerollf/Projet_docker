CREATE DATABASE docker_users;

\c docker_users

CREATE TABLE IF NOT EXISTS users(
                                    id SERIAL PRIMARY KEY,
                                    username varchar(255),
                                    email varchar(255),
                                    password_hash varchar(255),
                                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users(username, email, password_hash) VALUES('Shogaro', 'test@test.fr', '$2b$10$OsRJmKV.qelhOrup0IIfN.EUw6G9HS.1a4vqJxNsQG7Xngv/Ky.mm');