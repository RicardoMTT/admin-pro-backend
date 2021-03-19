const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { actualizarImagen } = require("../helpers/actualizarImagen");
const fs = require("fs");
const path = require("path");

const fileUpload = (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;
  const tipoValidos = ["hospitales", "medicos", "usuarios"];
  if (!tipoValidos.includes(tipo)) {
    res.status(400).json({
      ok: false,
      msg: "El tipo no es hospitales ,medicos , usuarios",
    });
  }
  //Validar que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No files were uploaded",
    });
  }
  //Procesar la imagen
  const file = req.files.imagen;
  const nombreCortado = file.name.split(".");
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  //Validar extension
  const extensionesValidas = ["png", "jpg", "jpeg", "gig"];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: "No es una extensión válida",
    });
  }

  // Generar el nombre del archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

  //Path para guardar la imagen
  const path = `./uploads/${tipo}/${nombreArchivo}`;
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Error al subir la imagen",
      });
    }

    console.log("id", id);
    // Update BD
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: "archivo subido",
      nombreArchivo,
    });
  });
};

const retornaImage = (req, res = response) => {
  const tipo = req.params.tipo;
  const foto = req.params.foto;
  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
  //Img por defecto

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/noimage.jpg`);
    res.sendFile(pathImg);
  }
};
module.exports = {
  fileUpload,
  retornaImage,
};
