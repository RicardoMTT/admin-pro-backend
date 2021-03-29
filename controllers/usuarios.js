const Usuario = require("../models/usuario");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;
  // const usuarios = await Usuario.find({}, "nombre email role google")
  //   .skip(desde)
  //   .limit(5);

  // const total = await Usuario.count();

  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nombre email role google img").skip(desde).limit(5),
    Usuario.countDocuments(),
  ]);
  res.json({
    ok: true,
    usuarios,
    uid: req.uid,
    total,
  });
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        msg: "No existe el usuario para ese Id",
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "Usuario borrado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        msg: "No existe el usuario para ese Id",
      });
    }

    const { password, google, email, ...campos } = req.body; //Obtener todo excepto el password,google
    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        //No se puede actualizar
        res.status(400).json({
          ok: false,
          msg: "Ya existe ese usauario con ese email",
        });
      }
    }
    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email != email) {
      return res.status(400).json({
        ok: false,
        msg: "Usuarios de google no pueden cambiar de correo",
      });
    }

    // delete campos.password;
    // delete campos.google;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usaurio: usuarioActualizado,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({
      email: email,
    });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo existe",
      });
    }

    const usuario = new Usuario(req.body);
    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    //Generar jwt
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
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
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
};
