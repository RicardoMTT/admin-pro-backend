const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");

//Crear el servidro de express
const app = express();

//Directorio public
app.use(express.static("public"));

//Configurar cors
app.use(cors());

// Lectura y parseo body
app.use(express.json());

dbConnection();
//Rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/hospitales", require("./routes/hospitales"));
app.use("/api/medicos", require("./routes/medicos"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/todo", require("./routes/busquedas"));
app.use("/api/upload", require("./routes/uploads"));

app.listen(process.env.PORT, () => {
  console.log("SERVER ON PORT", process.env.PORT);
});
