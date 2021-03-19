/*
    API /api/hospitales
*/

const { Router } = require("express");

const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campo");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getMedicos,
  borrarMedico,
  crearMedico,
  actualizarMedico,
} = require("../controllers/medicos");

/*
    Ruta: /api/usuarios
*/
const router = Router();

router.get("/", getMedicos);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del médico es necesario").not().isEmpty(),
    check("hospital", "El hospitalID deber ser  valido").isMongoId(),
    validarCampos,
  ],
  crearMedico
);
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre del hospital es necesario").not().isEmpty(),
    validarCampos,
  ],
  actualizarMedico
);
router.delete("/:id", borrarMedico);

module.exports = router;
