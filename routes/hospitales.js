/*
    API /api/hospitales
*/

const { Router } = require("express");

const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campo");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getHospitales,
  borrarHospital,
  crearHospital,
  actualizarHospital,
} = require("../controllers/hospitales");

/*
    Ruta: /api/usuarios
*/
const router = Router();

router.get("/", getHospitales);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del hospital es necesario").not().isEmpty(),
    validarCampos,
  ],
  crearHospital
);
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre del hospital es necesario").not().isEmpty(),
  ],
  actualizarHospital
);
router.delete("/:id", validarJWT, borrarHospital);

module.exports = router;
