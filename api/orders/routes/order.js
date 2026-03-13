const express = require("express");
const axios = require("axios");
const pool = require("./db");

const app = express();
app.use(express.json());

const PRODUCT_SERVICE =
  process.env.PRODUCT_SERVICE || "http://products:5002";

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/orders", async (req, res) => {
  const result = await pool.query("SELECT * FROM orders");
  res.json(result.rows);
});

app.get("/orders/:id", async (req, res) => {

  const result = await pool.query(
    "SELECT * FROM orders WHERE id=$1",
    [req.params.id]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: "order not found" });

  res.json(result.rows[0]);
});


app.get("/orders/user/:userId", async (req, res) => {

  const result = await pool.query(
    "SELECT * FROM orders WHERE user_id=$1",
    [req.params.userId]
  );

  res.json(result.rows);
});

app.post("/orders", async (req, res) => {

  const { user_id, product_id, quantity } = req.body;

  try {

    const productRes = await axios.get(
      `${PRODUCT_SERVICE}/products/${product_id}`
    );

    const product = productRes.data;

    if (product.stock < quantity)
      return res.status(400).json({ error: "not enough stock" });

    const total = product.price * quantity;

    await axios.post(
      `${PRODUCT_SERVICE}/products/${product_id}/decrement`,
      { quantity }
    );

    const result = await pool.query(
      `INSERT INTO orders(user_id,product_id,quantity,total_price,status)
       VALUES($1,$2,$3,$4,'created')
       RETURNING *`,
      [user_id, product_id, quantity, total]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    res.status(500).json({ error: "order creation failed" });

  }

});

app.listen(5003, () => {
  console.log("Orders service running on port 5003");
});
