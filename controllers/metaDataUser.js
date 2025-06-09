const MetaDataUser = require('../models/metaDataUser');
const { response } = require('express');

// POST /api/MetaDataUser -> crea o devuelve (upsert)
const createOrGetMetaDataUser = async (req, res = response) => {
  try {
    const { uid } = req;
    const stats = await MetaDataUser.findOneAndUpdate(
      { usuario: uid },
      { $setOnInsert: { usuario: uid } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(201).json({ ok: true, MetaDataUser: stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error al crear o recuperar stats personales' });
  }
};

// GET /api/MetaDataUser/:idUsuario
const getMetaDataUser = async (req, res = response) => {
  const { idUsuario } = req.params;
  try {
    const stats = await MetaDataUser.findOne({ usuario: idUsuario }).populate('usuario', 'nombre email');
    if (!stats) {
      return res.status(404).json({ ok: false, msg: 'No hay stats para este usuario' });
    }
    return res.json({ ok: true, MetaDataUser: stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener stats personales' });
  }
};

// GET /api/MetaDataUser/:idUsuario/light  -> versión ligera
const getMetaDataUserLight = async (req, res = response) => {
  const { idUsuario } = req.params;
  try {
    // Excluir arrays pesados
    const stats = await MetaDataUser.findOne({ usuario: idUsuario })
      .select('-retosDiariosCompletados -retosDiariosEnCurso -retosDiariosNoCompletados -retosDiariosCancelados'
            + ' -retosExtraDiariosCompletados -retosExtraDiariosEnCurso -retosExtraDiariosNoCompletados -retosExtraDiariosCancelados'
            + ' -retosSemanalesCompletados -retosSemanalesEnCurso -retosSemanalesNoCompletados -retosSemanalesCancelados'
            + ' -retosMensualesCompletados -retosMensualesEnCurso -retosMensualesNoCompletados -retosMensualesCancelados'
            + ' -retosDestacadosCompletados -retosDestacadosEnCurso -retosDestacadosNoCompletados -retosDestacadosCancelados'
            + ' -diaTareasCompleto -diasRutinasCompletadas -diasRutinasNoCompletadas -cuestionarioInicialCompletado'
            + ' -cuestionarioFinalCompletado -perfectDay');
    if (!stats) {
      return res.status(404).json({ ok: false, msg: 'No hay stats para este usuario' });
    }
    return res.json({ ok: true, MetaDataUser: stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener stats ligeros' });
  }
};

// PATCH /api/MetaDataUser/:idUsuario  -> update genérico
const updateMetaDataUser = async (req, res = response) => {
  const { idUsuario } = req.params;
  const body = req.body;
  const pushOps = {};
  const setOps = {};

  Object.keys(body).forEach(key => {
    const val = body[key];
    if (Array.isArray(val)) {
      pushOps[key] = { $each: val };
    } else {
      setOps[key] = val;
    }
  });

  const update = {};
  if (Object.keys(setOps).length) update.$set = setOps;
  if (Object.keys(pushOps).length) update.$push = pushOps;

  try {
    const stats = await MetaDataUser.findOneAndUpdate(
      { usuario: idUsuario },
      update,
      { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json({ ok: true, MetaDataUser: stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error al actualizar stats personales' });
  }
};

// DELETE /api/MetaDataUser/:idUsuario
const deleteMetaDataUser = async (req, res = response) => {
  const { idUsuario } = req.params;
  try {
    const stats = await MetaDataUser.findOneAndDelete({ usuario: idUsuario });
    if (!stats) {
      return res.status(404).json({ ok: false, msg: 'No hay stats para eliminar' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error al eliminar stats personales' });
  }
};

// —— Generadores de handlers para arrays de fechas ——
const dateFields = [
  'retosDiariosCompletados','retosDiariosEnCurso','retosDiariosNoCompletados','retosDiariosCancelados',
  'retosExtraDiariosCompletados','retosExtraDiariosEnCurso','retosExtraDiariosNoCompletados','retosExtraDiariosCancelados',
  'retosSemanalesCompletados','retosSemanalesEnCurso','retosSemanalesNoCompletados','retosSemanalesCancelados',
  'retosMensualesCompletados','retosMensualesEnCurso','retosMensualesNoCompletados','retosMensualesCancelados',
  'retosDestacadosCompletados','retosDestacadosEnCurso','retosDestacadosNoCompletados','retosDestacadosCancelados',
  'diaTareasCompleto', 'diaTareasNoCompleto','diasRutinasCompletadas','diasRutinasNoCompletadas',
  'cuestionarioInicialCompletado','cuestionarioFinalCompletado','perfectDay'
];

dateFields.forEach(field => {
  const exportName = 'agregar' + field.charAt(0).toUpperCase() + field.slice(1);
  module.exports[exportName] = async (req, res = response) => {
    const { idUsuario } = req.params;
    const { date } = req.body;
    try {
      const stats = await MetaDataUser.findOneAndUpdate(
        { usuario: idUsuario },
        { $addToSet: { [field]: new Date(date) } },
        { new: true }
      );
      if (!stats) return res.status(404).json({ ok: false, msg: 'No encontrado' });
      return res.json({ ok: true, MetaDataUser: stats });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, msg: 'Error interno al agregar fecha' });
    }
  };
});

// —— Generadores de handlers para valores numéricos ——
const makeSet = (field) => async (req, res = response) => {
  const { idUsuario } = req.params;
  const { value } = req.body;
  try {
    const stats = await MetaDataUser.findOneAndUpdate(
      { usuario: idUsuario },
      { $set: { [field]: value } },
      { new: true }
    );
    if (!stats) return res.status(404).json({ ok: false, msg: 'No encontrado' });
    return res.json({ ok: true, MetaDataUser: stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error interno al actualizar número' });
  }
};

const makeInc = (field) => async (req, res = response) => {
  const { idUsuario } = req.params;
  const { delta } = req.body;
  try {
    const stats = await MetaDataUser.findOneAndUpdate(
      { usuario: idUsuario },
      { $inc: { [field]: delta } },
      { new: true, upsert: true, setDefaultsOnInsert: true }  // <-- aquí
    );
    return res.json({ ok: true, MetaDataUser: stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error interno al incrementar número' });
  }
};

// Export genéricos para números, doubles y rachas
module.exports.createOrGetMetaDataUser = createOrGetMetaDataUser;
module.exports.getMetaDataUser = getMetaDataUser;
module.exports.getMetaDataUserLight = getMetaDataUserLight;
module.exports.updateMetaDataUser = updateMetaDataUser;
module.exports.deleteMetaDataUser = deleteMetaDataUser;
module.exports.setNumero = (field) => makeSet(field);
module.exports.incNumero = (field) => makeInc(field);
module.exports.setDouble = (field) => makeSet(field);
module.exports.setRacha = (field) => makeSet(field);
module.exports.incRacha = (field) => makeInc(field);
module.exports.setMetric = (field) => makeSet(field);
