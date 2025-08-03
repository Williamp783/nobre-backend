const express = require("express");
//const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

const routeContrato = require("./routes/routeContrato");
app.use("/api", routeContrato);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
