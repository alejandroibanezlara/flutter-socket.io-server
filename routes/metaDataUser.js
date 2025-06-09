/*
    path: api/metaDataUser
*/
// routes/metaDataUser.js
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const MetaDataUser = require('../models/metaDataUser');
const controllers = require('../controllers/metaDataUser');
const {
  createOrGetMetaDataUser,
  getMetaDataUser,
  getMetaDataUserLight,
  updateMetaDataUser,
  deleteMetaDataUser,

  // Fechas
  agregarRetosDiariosCompletados,
  agregarRetosDiariosEnCurso,
  agregarRetosDiariosNoCompletados,
  agregarRetosDiariosCancelados,
  agregarRetosExtraDiariosCompletados,
  agregarRetosExtraDiariosEnCurso,
  agregarRetosExtraDiariosNoCompletados,
  agregarRetosExtraDiariosCancelados,
  agregarRetosSemanalesCompletados,
  agregarRetosSemanalesEnCurso,
  agregarRetosSemanalesNoCompletados,
  agregarRetosSemanalesCancelados,
  agregarRetosMensualesCompletados,
  agregarRetosMensualesEnCurso,
  agregarRetosMensualesNoCompletados,
  agregarRetosMensualesCancelados,
  agregarRetosDestacadosCompletados,
  agregarRetosDestacadosEnCurso,
  agregarRetosDestacadosNoCompletados,
  agregarRetosDestacadosCancelados,
  agregarDiaTareasCompleto,
  agregarDiasRutinasCompletadas,
  agregarDiasRutinasNoCompletadas,
  agregarCuestionarioInicialCompletado,
  agregarCuestionarioFinalCompletado,
  agregarPerfectDay,

  // Contadores y doubles
  setNumero,
  incNumero,
  setDouble
} = require('../controllers/metaDataUser');

const router = Router();

// Upsert: crea o devuelve
router.post('/', validarJWT, createOrGetMetaDataUser);

// Lectura
router.get('/:idUsuario', validarJWT, getMetaDataUser);
router.get('/:idUsuario/light', validarJWT, getMetaDataUserLight);

// Update genérico
router.patch('/:idUsuario', validarJWT, updateMetaDataUser);

// DELETE
router.delete('/:idUsuario', validarJWT, deleteMetaDataUser);

// —— Fechas ——
// mapeo directo sin eval para mayor claridad
router.patch('/:idUsuario/retosDiariosCompletados',   validarJWT, agregarRetosDiariosCompletados);
router.patch('/:idUsuario/retosDiariosEnCurso',      validarJWT, agregarRetosDiariosEnCurso);
router.patch('/:idUsuario/retosDiariosNoCompletados',validarJWT, agregarRetosDiariosNoCompletados);
router.patch('/:idUsuario/retosDiariosCancelados',   validarJWT, agregarRetosDiariosCancelados);

// …repite para cada uno de los arrays de fechas…
router.patch('/:idUsuario/perfectDay',                validarJWT, agregarPerfectDay);

// —— Contadores (set / inc) ——
// Por ejemplo:
router.patch('/:idUsuario/tareasCompletadas',   validarJWT, setNumero('tareasCompletadas'));
router.patch('/:idUsuario/inc/tareasCompletadas', validarJWT, incNumero('tareasCompletadas'));

router.patch('/:idUsuario/rachaTareas',     validarJWT, setNumero('rachaTareas'));
router.patch('/:idUsuario/rachaMaximaTareas',validarJWT, setNumero('rachaMaximaTareas'));
router.patch('/:idUsuario/rachaRutinas',     validarJWT, setNumero('rachaRutinas'));
router.patch('/:idUsuario/rachaMaximaRutinas',validarJWT,setNumero('rachaMaximaRutinas'));
router.patch('/:idUsuario/rachaRetosDiarios',validarJWT, setNumero('rachaRetosDiarios'));
router.patch('/:idUsuario/rachaMaximaRetosDiarios', validarJWT, setNumero('rachaMaximaRetosDiarios'));


// router.patch(
//   '/:idUsuario/inc/retosCarisma',
//   validarJWT,
//   incNumero('retosCarisma')
// );

// router.patch(
//   '/:idUsuario/inc/puntosCarisma',
//   validarJWT,
//   incNumero('puntosCarisma')
// );

// Lista de todos los campos de fecha que queremos exponer
const dateFields = [
  'retosDiariosCompletados','retosDiariosEnCurso','retosDiariosNoCompletados','retosDiariosCancelados',
  'retosExtraDiariosCompletados','retosExtraDiariosEnCurso','retosExtraDiariosNoCompletados','retosExtraDiariosCancelados',
  'retosSemanalesCompletados','retosSemanalesEnCurso','retosSemanalesNoCompletados','retosSemanalesCancelados',
  'retosMensualesCompletados','retosMensualesEnCurso','retosMensualesNoCompletados','retosMensualesCancelados',
  'retosDestacadosCompletados','retosDestacadosEnCurso','retosDestacadosNoCompletados','retosDestacadosCancelados',
  'diaTareasCompleto','diaTareasNoCompleto','diasRutinasCompletadas','diasRutinasNoCompletadas',
  'cuestionarioInicialCompletado','cuestionarioFinalCompletado','perfectDay'
];

// Función auxiliar para capitalizar el nombre del método
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Por cada campo de fecha, montamos la ruta y su controlador
dateFields.forEach(field => {
  const handlerName = 'agregar' + capitalize(field);
  if (typeof controllers[handlerName] !== 'function') {
    console.warn(`Controlador ${handlerName} no existe`);
    return;
  }
  router.patch(
    `/:idUsuario/${field}`,
    validarJWT,
    controllers[handlerName]
  );
});

router.patch(
  '/:idUsuario/inc/:campo',
  validarJWT,
  async (req, res) => {
    const { idUsuario, campo } = req.params;
    const { delta } = req.body;
    try {
      const stats = await MetaDataUser.findOneAndUpdate(
        { usuario: idUsuario },
        { $inc: { [campo]: delta } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json({ ok: true, MetaDataUser: stats });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        msg: `Error al incrementar el campo '${campo}'`
      });
    }
  }
);
// …y análogamente para el resto de campos numéricos y doubles…

module.exports = router;