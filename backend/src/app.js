const express = require("express");
const cors = require("cors");
require("dotenv").config();

const fbRoutes = require("./routes/facebook.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/facebook", fbRoutes);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});