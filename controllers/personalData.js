const PersonalData = require('../models/PersonalData');
const { response } = require('express');
const Microlearning = require('../models/Microlearning');

// Campos permitidos para update parcial
const allowedFields = [
  'calidadSueno',
  'actitudInicial',
  'actitudFinal',
  'diaCompletado',
  'mantras',
  'mantraFavorito',
  'rachaActual',
  'rachaMaxima',
  'contadorRetosDia',
  'contadorRetosSemana',
  'contadorRetosMes',
  'contadorRetosDestacados',
  'inicioDia',
  'finJornada',
  'picoEnergia',
  'rutinaDiaria',
  'actividadFisica',
  'genero',
  'tiempoReflexion',
  'prefAprendizaje',
  'nivelDisciplina',
  'satisfaccionActual',
  'preguntasInicialesRespondidas',
  'fechaCuestionarioInicial',
  'notificacionesActivadas',
];

// POST /personalData  -> Crea (si no existe) o devuelve el registro
const createOrGetPersonalData = async (req, res = response) => {
  try {
    const { uid } = req;
    const data = await PersonalData.findOneAndUpdate(
      { usuario: uid },
      { $setOnInsert: { usuario: uid } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ ok: true, personalData: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al crear o recuperar datos personales'});
  }
};

// GET /personalData/:idUsuario
const getPersonalData = async (req, res = response) => {
  const { idUsuario } = req.params;

  try {
    const data = await PersonalData.findOne({ usuario: idUsuario }).populate('usuario', 'nombre email');

    if (!data) {
      return res.status(404).json({ ok: false, msg: 'No hay datos personales para este usuario' });
    }

    // Buscar los microlearnings completos usando los IDs en cardsAleatorias
    const microlearnings = await Microlearning.find({
      _id: { $in: data.cardsAleatorias }
    });

    // Convertimos a objeto para poder añadir campo personalizado
    const dataObj = data.toObject();
    dataObj.microlearnings = microlearnings;

    return res.json({ ok: true, personalData: dataObj });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error al leer datos personales' });
  }
};

// PATCH /personalData/:idUsuario -> Inserta nuevas entradas en arrays o ajusta otros campos
const updatePersonalData = async (req, res = response) => {
    const { idUsuario } = req.params;
    const body = req.body;
  
    // Separar operadores: $push para arrays, $set para valores simples
    const pushOps = {};
    const setOps  = {};
  
    Object.keys(body).forEach(key => {
      if (!allowedFields.includes(key)) return;
      const value = body[key];
      if (Array.isArray(value)) {
        // Se espera un array de objetos para insertar
        pushOps[key] = { $each: value };
      } else {
        setOps[key] = value;
      }
    });
  
    // Construir objeto de actualización
    const update = {};
    if (Object.keys(setOps).length)  update.$set  = setOps;
    if (Object.keys(pushOps).length) update.$push = pushOps;
  
    try {
      const data = await PersonalData.findOneAndUpdate(
        { usuario: idUsuario },
        update,
        {
          new: true,
          runValidators: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );
      res.json({ ok: true, personalData: data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: 'Error al actualizar datos personales' });
    }
  };

// DELETE /personalData/:idUsuario
const deletePersonalData = async (req, res = response) => {
  const { idUsuario } = req.params;
  try {
    const data = await PersonalData.findOneAndDelete({ usuario: idUsuario });
    if (!data) {
      return res.status(404).json({ ok: false, msg: 'No hay datos personales para eliminar' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al eliminar datos personales' });
  }
};

// PATCH /api/personalData/:idUsuario/replaceCards
const replaceMicrolearningCards = async (req, res = response) => {
  const { idUsuario } = req.params;
  const { cardIds } = req.body;

  
  if (!Array.isArray(cardIds) || cardIds.length !== 3) {
    return res.status(400).json({ success: false, message: 'Debes enviar exactamente 3 IDs de microlearning.' });
  }
  
  
  try {
    const data = await PersonalData.findOneAndUpdate(
      { usuario: idUsuario },
      { $set: { cardsAleatorias: cardIds } },
      { new: true }
    );

    return res.status(200).json({ success: true, personalData: data });
  } catch (error) {
    console.error('replaceMicrolearningCards:', error);
    return res.status(500).json({ success: false, message: 'Error al reemplazar las tarjetas' });
  }

};



const agregarCalidadSueno = async (req, res) => {
  const { idUsuario } = req.params;
  const { nota, fecha } = req.body;

  try {
    const actualizado = await PersonalData.findOneAndUpdate(
      { usuario: idUsuario },
      { $push: { calidadSueno: { nota, fecha: new Date(fecha) } } },
      { new: true, upsert: false }
    );

    if (!actualizado) return res.status(404).json({ msg: 'No se encontró PersonalData' });

    res.json({ ok: true, personalData: actualizado });
  } catch (error) {
    console.error('Error en agregarCalidadSueno:', error);
    res.status(500).json({ msg: 'Error interno al agregar calidad de sueño' });
  }
};


const agregarActitudInicial = async (req, res) => {
  const { idUsuario } = req.params;
  const { nota, fecha } = req.body;

  try {
    const actualizado = await PersonalData.findOneAndUpdate(
      { usuario: idUsuario },
      { $push: { actitudInicial: { nota, fecha: new Date(fecha) } } },
      { new: true, upsert: false }
    );

    if (!actualizado) return res.status(404).json({ msg: 'No se encontró PersonalData' });

    res.json({ ok: true, personalData: actualizado });
  } catch (error) {
    console.error('Error en agregarActitudInicial:', error);
    res.status(500).json({ msg: 'Error interno al agregar actitud inicial' });
  }
};


const agregarActitudFinal = async (req, res) => {
  const { idUsuario } = req.params;
  const { nota, fecha } = req.body;

  try {
    const actualizado = await PersonalData.findOneAndUpdate(
      { usuario: idUsuario },
      { $push: { actitudFinal: { nota, fecha: new Date(fecha) } } },
      { new: true, upsert: false }
    );

    if (!actualizado) return res.status(404).json({ msg: 'No se encontró PersonalData' });

    res.json({ ok: true, personalData: actualizado });
  } catch (error) {
    console.error('Error en agregarActitudFinal:', error);
    res.status(500).json({ msg: 'Error interno al agregar actitud final' });
  }
};


const agregarDiaCompletado = async (req, res) => {
  const { idUsuario } = req.params;
  const { completado, fecha } = req.body;

  try {
    const actualizado = await PersonalData.findOneAndUpdate(
      { usuario: idUsuario },
      { $push: { diaCompletado: { completado, fecha: new Date(fecha) } } },
      { new: true, upsert: false }
    );

    if (!actualizado) return res.status(404).json({ msg: 'No se encontró PersonalData' });

    res.json({ ok: true, personalData: actualizado });
  } catch (error) {
    console.error('Error en agregarDiaCompletado:', error);
    res.status(500).json({ msg: 'Error interno al agregar día completado' });
  }
};


const getPersonalDataLight = async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const personalData = await PersonalData.findOne({ usuario: idUsuario })
      .select('-actitudFinal -actitudInicial -calidadSueno');

    if (!personalData) {
      return res.status(404).json({ msg: 'No se encontró PersonalData' });
    }

    res.json({ ok: true, personalData });
  } catch (error) {
    console.error('Error en getPersonalDataLight:', error);
    res.status(500).json({ msg: 'Error interno al obtener datos ligeros' });
  }
};


module.exports = {
  createOrGetPersonalData,
  getPersonalData,
  updatePersonalData,
  deletePersonalData,
  replaceMicrolearningCards,
  agregarCalidadSueno,
  agregarActitudInicial,
  agregarActitudFinal,
  agregarDiaCompletado,
  getPersonalDataLight,
};