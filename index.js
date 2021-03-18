const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");

//Crear el servidro de express
const app = express();

//Configurar cors
app.use(cors());

dbConnection();
//Rutas
app.get("/", (req, res) => {
  res.json({
    ok: true,
    msg: "Hola",
  });
});

app.listen(process.env.PORT, () => {
  console.log("SERVER ON PORT", process.env.PORT);
});
