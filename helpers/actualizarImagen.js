const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");
const fs = require("fs");

const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    //Borar la img anterior
    fs.unlinkSync(path);
  }
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
  // Ver la info
  pathViejo = "";
  switch (tipo) {
    case "medicos":
      const medico = await Medico.findById(id);
      if (!medico) {
        console.log("xd");
        return false;
      }

      pathViejo = `./uploads/medicos/${medico.img}`;
      borrarImagen(pathViejo);

      medico.img = nombreArchivo;
      console.log("medico", medico);
      await medico.save();
      return true;

    case "hospitales":
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        console.log("xd");
        return false;
      }

      pathViejo = `./uploads/hospitales/${hospital.img}`;
      borrarImagen(pathViejo);

      hospital.img = nombreArchivo;
      await hospital.save();
      return true;

    case "usuarios":
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        console.log("xd");
        return false;
      }

      pathViejo = `./uploads/usuarios/${usuario.img}`;
      borrarImagen(pathViejo);

      usuario.img = nombreArchivo;
      await usuario.save();
      return true;

    default:
      break;
  }
};
module.exports = {
  actualizarImagen,
};
