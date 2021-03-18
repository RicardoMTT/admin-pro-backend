const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");

//Crear el servidro de express
const app = express();

//Configurar cors
app.use(cors());

// Lectura y parseo body
app.use(express.json());

dbConnection();
//Rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/login", require("./routes/auth"));

app.listen(process.env.PORT, () => {
  console.log("SERVER ON PORT", process.env.PORT);
});
