const Usuario = require("../models/usuario");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const Medico = require("../models/medico");

const getMedicos = async (req, res) => {
  const medicos = await Medico.find()
    .populate("usuario", "nombre img")
    .populate("hospital", "nombre img");
  res.json({
    ok: true,
    medicos,
  });
};

const borrarMedico = async (req, res = response) => {
  const id = req.params.id;

  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: "Medico no encontrado",
      });
    }

    await Medico.findByIdAndDelete(id);
    res.json({
      ok: true,
      msg: "Medico borrado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const actualizarMedico = async (req, res = response) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: "Medico no encontrado",
      });
    }
    //   hospital.nombre = req.body.nombre;

    const cambiosMedico = {
      ...req.body,
      usuario: uid,
    };

    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      cambiosMedico,
      { new: true }
    );

    res.json({
      ok: true,
      medico: medicoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({
    usuario: uid,
    ...req.body,
  });
  try {
    const medicoDB = await medico.save();

    res.json({
      ok: true,
      medicoDB,
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
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
};
