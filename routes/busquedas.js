/**
 * API api/todo/:busqueda
 *
 */

const { Router } = require("express");

const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campo");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getBusqueda,
  getDocumentosColeccion,
} = require("../controllers/busquedas");

/*
    Ruta: /api/usuarios
*/
const router = Router();

router.get("/:busqueda", validarJWT, getBusqueda);
router.get("/coleccion/:tabla/:busqueda", validarJWT, getDocumentosColeccion);

module.exports = router;
