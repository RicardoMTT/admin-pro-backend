const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        msg: "email no valido ",
      });
    }

    //Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);

    if (!validPassword) {
      res.status(400).json({
        ok: false,
        msg: "Contraseña no válida",
      });
    }

    //Generar el token
    const token = await generarJWT(usuarioDB.id);

    res.status(200).json({
      ok: true,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const googleSignIn = async (req, res) => {
  const googleToken = req.body.token;
  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;
    if (!usuarioDB) {
      //Si no existe el usuario
      usuario = new Usuario({
        nombre: name,
        email,
        password: "xxx",
        img: picture,
        google: true,
      });
    } else {
      usuario = usuarioDB;
      usuario.google = true;
    }

    //Guardar en DB
    await usuario.save();
    //Generar jwt

    const token = await generarJWT(usuario.id);
    res.json({
      ok: true,
      msg: "Google signin",
      token,
    });
  } catch (error) {
    console.log("er", error);
    res.status(401).json({
      ok: false,
      msg: "Token gg",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;
  // Generar el token JWT

  const token = await generarJWT(uid);

  //Obtener usuario por uuid
  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    token,
    usuario,
  });
};
module.exports = {
  login,
  googleSignIn,
  renewToken,
};
