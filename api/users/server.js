const express = require("express");
const usersRoutes = require("./routes/users");

const app = express();
app.use(express.json());

app.use("/users", usersRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(5001, () => {
  console.log("Users service running on port 5001");
});
