const express = require("express");
const productsRoutes = require("./routes/products");

const app = express();
app.use(express.json());

app.use("/products", productsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(5001, () => {
  console.log("products service running on port 5001");
});
