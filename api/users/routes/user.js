const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const users = await pool.query("SELECT id, username, email FROM users");
  res.json(users.rows);
});

router.get("/:id", async (req, res) => {
  const user = await pool.query(
    "SELECT id, username, email FROM users WHERE id=$1",
    [req.params.id]
  );
  res.json(user.rows[0]);
});

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await pool.query(
    "INSERT INTO users(username,email,password_hash) VALUES($1,$2,$3) RETURNING id",
    [username, email, hash]
  );

  res.json(user.rows[0]);
});

router.put("/:id", async (req, res) => {
  const { username, email } = req.body;

  await pool.query(
    "UPDATE users SET username=$1,email=$2 WHERE id=$3",
    [username, email, req.params.id]
  );

  res.json({ updated: true });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);

  res.json({ deleted: true });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows[0]) return res.status(401).json({ error: "Invalid login" });

  const valid = await bcrypt.compare(password, user.rows[0].password_hash);

  if (!valid) return res.status(401).json({ error: "Invalid login" });

  res.json({ message: "login success", user_id: user.rows[0].id });
});

module.exports = router;
