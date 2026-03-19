const express = require('express');
const Pool = require("pg-pool");
const app = express();
const port = 5003

const pool = new Pool({
    connectionString: "postgresql://postgres:password@db_order/docker_orders"
})
app.use(express.json());

app.get('/orders', async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM orders");

        const allOrders = result.rows;
        res.status(200).json(allOrders);
    }catch(e){
        console.error(e);
        res.status(500).json({error:"Error getting orders"});
    }
})

app.get('/orders/:id', async (req, res) => {
    try{
        const orderId = req.params.id;

        const result = await pool.query("SELECT * FROM orders WHERE id=$1", [orderId]);

        const order = result.rows[0]

        res.status(200).json(order);

    }catch(e){
        console.error(e);
        res.status(500).json({error:"Error getting orders"});
    }
})

app.get('/orders/user/:userId', async (req, res) => {
    try{
        const userId = req.params.userId

        const result = await pool.query("SELECT * FROM orders WHERE user_id=$1", [userId]);

        const allOrders = result.rows;
        res.status(200).json(allOrders);

    }catch(e){
        console.error(e);
        res.status(500).json({error:"Error getting orders"});
    }
})

app.post('/orders', async (req, res) => {
    try{
        const {userId, productId, quantity, totalPrice} = req.body;

        const result = await pool.query(`
        INSERT INTO orders(user_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4)
        RETURNING id, user_id as "userId", product_id as "productId", quantity, total_price
        `, [userId, productId, quantity, totalPrice])

        const createdOrder = result.rows[0];

        res.status(200).json({message: "Order created",createdOrder});
    }catch (e) {
        console.error(e);
        res.status(500).json({error:"Error creating order"});
    }
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})