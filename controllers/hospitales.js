const Usuario = require("../models/usuario");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const Hospital = require("../models/hospital");

const getHospitales = async (req, res) => {
  const hospitales = await Hospital.find().populate("usuario", "nombre");

  res.json({
    ok: true,
    hospitales,
  });
};

const borrarHospital = async (req, res = response) => {
  const id = req.params.id;

  try {
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: "Hospital no encontrado",
      });
    }

    await Hospital.findByIdAndDelete(id);
    res.json({
      ok: true,
      msg: "hospital borrado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const actualizarHospital = async (req, res = response) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: "Hospital no encontrado",
      });
    }
    //   hospital.nombre = req.body.nombre;

    const cambiosHospital = {
      ...req.body,
      usuario: uid,
    };

    const hospitalActualizado = await Hospital.findByIdAndUpdate(
      id,
      cambiosHospital,
      { new: true }
    );

    res.json({
      ok: true,
      hospital: hospitalActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const crearHospital = async (req, res = response) => {
  const uid = req.uid;

  const hospital = new Hospital({
    usuario: uid,
    ...req.body,
  });
  hospital.usuario = uid;
  try {
    const hospitalDB = await hospital.save();

    res.json({
      ok: true,
      hospital: hospitalDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
};
