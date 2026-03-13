const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
});

app.get("/products/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE id=$1",
    [req.params.id]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: "product not found" });

  res.json(result.rows[0]);
});

app.post("/products", async (req, res) => {
  const { name, price, stock } = req.body;

  const result = await pool.query(
    `INSERT INTO products(name,price,stock)
     VALUES($1,$2,$3) RETURNING *`,
    [name, price, stock]
  );

  res.status(201).json(result.rows[0]);
});

app.put("/products/:id", async (req, res) => {
  const { name, price, stock } = req.body;

  const result = await pool.query(
    `UPDATE products
     SET name=$1, price=$2, stock=$3
     WHERE id=$4 RETURNING *`,
    [name, price, stock, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/products/:id", async (req, res) => {
  await pool.query("DELETE FROM products WHERE id=$1", [req.params.id]);
  res.json({ message: "product deleted" });
});

app.post("/products/:id/decrement", async (req, res) => {

  const { quantity } = req.body;

  const result = await pool.query(
    "SELECT * FROM products WHERE id=$1",
    [req.params.id]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: "product not found" });

  const product = result.rows[0];

  if (product.stock < quantity)
    return res.status(400).json({ error: "not enough stock" });

  await pool.query(
    "UPDATE products SET stock = stock - $1 WHERE id=$2",
    [quantity, req.params.id]
  );

  res.json({ message: "stock updated" });
});

app.listen(5002, () => {
  console.log("Products service running on port 5002");
});
