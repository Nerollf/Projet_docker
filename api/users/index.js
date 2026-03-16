const express = require('express');
const Pool = require("pg-pool");
const bcrypt = require("bcrypt");
const app = express();
const port = 5001

const pool = new Pool({
    connectionString: "postgresql://postgres:password@db_users/docker_users"
})
app.use(express.json());

app.get('/users', async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM users ORDER BY id");

        const allUsers = result.rows;

        res.status(200).json(allUsers);
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Something went wrong"});
    }
})

app.get('/users:id', async (req, res) => {
    try{
        const userId = req.params.id;

        const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

        const user = result.rows[0]

        res.status(200).json(user);
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Something went wrong"});
    }
})

app.post('/users', async (req, res) => {
    try{
        const {username, password, email} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(`
        INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3)
        RETURNING username, email,password_hash as "passwordHash"
        `, [username, email, hashedPassword])

        const createdUser = result.rows[0];

        res.status(200).json({message: "Successfully created user", createdUser});

    }catch(err){
        console.error(err);
        res.status(500).json({message: "Something went wrong"});
    }
})

app.put('/users/:id', async (req, res) => {
    try{
        const userId = req.params.id;
        const {username,email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(`
        UPDATE users SET username=$1, email=$2, password_hash=$3 WHERE id = $4
        `, [username, email, hashedPassword, userId])

        res.status(200).json({message: "Successfully updated user"});

    }catch(err){
        console.error(err);
        res.status(500).json({message: "Something went wrong"});
    }
})

app.delete('/users/:id', async (req, res) => {
    try{
        const userId = req.params.id;
        await pool.query(`
        DELETE FROM users WHERE id = $1`, [userId])

        res.status(200).json({message: "Successfully deleted user"});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Something went wrong"});
    }
})

app.post('/users/login', async (req, res) => {
    try{
        const {username, password} = req.body

        const result = await pool.query(`
        SELECT * FROM users WHERE username = $1
        `, [username])

        const user = result.rows[0]

        if (!user) {
            return res.status(401).json({error: 'Email ou mot de passe incorrect'})
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash)
        if (!passwordMatch) {
            return res.status(401).json({error: 'Email ou mot de passe incorrect'})
        }

        res.status(200).json({message: "Successfully logged in", user})
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Something went wrong"});
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})