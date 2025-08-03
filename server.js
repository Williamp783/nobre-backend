const express = require("express");
//const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Content-Disposition"],
  })
);


const routeContrato = require("./routes/routeContrato");
app.use("/api", routeContrato);


const routeRecaptcha = require("./routes/routeRecaptcha");
app.use("/api", routeRecaptcha);

const routePesquisaPlaca = require("./routes/routePesquisaPlaca");
app.use("/api", routePesquisaPlaca);

const routeEmail = require("./routes/routerEmail");
app.use("/api", routeEmail);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
