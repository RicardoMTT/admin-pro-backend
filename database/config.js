const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("DB connect");
  } catch (error) {
    console.log("error", error);
    throw new Error("Error en la conexion");
  }
};

module.exports = {
  dbConnection,
};
