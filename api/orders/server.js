const express = require("express");
const ordersRoutes = require("./routes/orders");

const app = express();
app.use(express.json());

app.use("/orders", ordersRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(5001, () => {
  console.log("orders service running on port 5001");
});
