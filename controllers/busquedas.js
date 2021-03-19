const { response } = require("express");
const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

const getBusqueda = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");
  //   const usuarios = await Usuario.find({ nombre: regex });
  //   const medicos = await Medico.find({ nombre: regex });
  //   const hospitales = await Hospital.find({ nombre: regex });
  console.log(busqueda);

  const [usuarios, medicos, hospitales] = await Promise.all([
    Usuario.find({ nombre: regex }),
    Medico.find({ nombre: regex }),
    Hospital.find({ nombre: regex }),
  ]);

  res.json({
    ok: true,
    usuarios,
    medicos,
    hospitales,
  });
};

const getDocumentosColeccion = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const tabla = req.params.tabla;
  const regex = new RegExp(busqueda, "i");
  let data = [];

  switch (tabla) {
    case "medicos":
      data = await Medico.find({ nombre: regex })
        .populate("usuario", "nombre img")
        .populate("hospital", "nombre img");
      break;

    case "hospitales":
      data = await Hospital.find({ nombre: regex }).populate(
        "usuario",
        "nombre img"
      );
      break;

    case "usuarios":
      data = await Usuario.find({ nombre: regex });
      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: "La tabla debe ser usuarios/medicos/hospitales",
      });
  }
  console.log(data);

  res.status(200).json({
    ok: true,
    resultados: data,
  });
};

module.exports = {
  getBusqueda,
  getDocumentosColeccion,
};