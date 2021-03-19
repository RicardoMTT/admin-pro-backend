/**
 * API api/uploads
 *
 */

const { Router } = require("express");
const { fileUpload, retornaImage } = require("../controllers/uploads");
const expressFileUpload = require("express-fileupload");

const { validarJWT } = require("../middlewares/validar-jwt");

/*
     Ruta: /api/usuarios
 */
const router = Router();
router.use(expressFileUpload());

router.put("/:tipo/:id", validarJWT, fileUpload);
router.get("/:tipo/:foto", retornaImage);

module.exports = router;
