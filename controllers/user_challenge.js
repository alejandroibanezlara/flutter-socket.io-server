// controllers/userChallengeController.js
const { UserChallenge } = require('../models/challenge');

// Crear un nuevo UserChallenge cuando el usuario acepta un reto
const createUserChallenge = async (req, res = response) => {
  try {
    // 1) Recuperar userId del JWT
    const userId = req.uid;
    if (!userId) {
      return res.status(401).json({ ok: false, msg: 'Token inválido' });
    }

    // 2) Extraer del cuerpo los campos necesarios
    const {
      challengeId,
      counter,
      writing,
      checklist
    } = req.body;

    if (!challengeId) {
      return res.status(400).json({ ok: false, msg: 'Falta challengeId' });
    }

    // 3) Construir el objeto de creación, incluyendo solo los campos definidos
    const newData = { userId, challengeId };
    if (counter    !== undefined) newData.counter    = counter;
    if (writing    !== undefined) newData.writing    = writing;
    if (checklist  !== undefined) newData.checklist  = checklist;

    // 4) Crear el documento en la base de datos
    const nuevo = await UserChallenge.create(newData);
    // 5) Devolver respuesta
    return res.status(201).json({ ok: true, userChallenge: nuevo });
  } catch (err) {
    console.error('Error en createUserChallenge:', err);
    return res.status(500).json({ ok: false, msg: 'Error creando UserChallenge' });
  }
};


// Listar todos los UserChallenges del usuario
 const getUserChallenges = async (req, res) => {
  try {
    const userId = req.uid;  
    if (!userId) {
        return res.status(401).json({ ok: false, msg: 'Token inválido' });
      }
    const lista = await UserChallenge.find({ userId });
    return res.json({ ok: true, userChallenges: lista });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error listando UserChallenges' });
  }
};

// Obtener un UserChallenge por su _id
 const getUserChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const uc = await UserChallenge.findById(id);
    if (!uc) return res.status(404).json({ ok: false, msg: 'No existe UserChallenge' });
    return res.json({ ok: true, userChallenge: uc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error obteniendo UserChallenge' });
  }
};

// Actualizar datos de progreso en un UserChallenge
 const updateUserChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body; // p.ej. { currentTotal, progressData, streakDays }
    cambios.lastUpdated = Date.now();
    const actualizado = await UserChallenge.findByIdAndUpdate(id, cambios, { new: true });
    if (!actualizado) return res.status(404).json({ ok: false, msg: 'No existe UserChallenge' });
    return res.json({ ok: true, userChallenge: actualizado });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error actualizando UserChallenge' });
  }
};

// “Finalizar por hoy”: desactiva el reto y registra endDate parcial
const finishToday = async (req, res) => {
    try {
      const { id } = req.params;
      // 1) Recogemos los datos enviados por el cliente
      const { currentTotal, progressData, streakDays } = req.body;
  
      // 2) Preparamos el objeto de cambios
      const cambios = {
        isActive: false,
        status:   'completed',
        endDate:  Date.now(),
        lastUpdated: Date.now(),
      };
  
      // 3) Si viene currentTotal, lo añadimos
      if (typeof currentTotal === 'number') {
        cambios.currentTotal = currentTotal;
      }
      // 4) Si viene progressData (por ej. para otros tipos), lo añadimos
      if (progressData !== undefined) {
        cambios.progressData = progressData;
      }
      // 5) Si viene streakDays (para retos diarios, tempo, etc.), lo añadimos
      if (typeof streakDays === 'number') {
        cambios.streakDays = streakDays;
      }
  
      // 6) Aplicamos la actualización
      const actualizado = await UserChallenge.findByIdAndUpdate(
        id,
        { $set: cambios },
        { new: true }
      );
      if (!actualizado) {
        return res.status(404).json({ ok: false, msg: 'No existe UserChallenge' });
      }
  
      // 7) Devolvemos el documento actualizado
      return res.json({ ok: true, userChallenge: actualizado });
    } catch (err) {
      console.error('Error en finishToday:', err);
      return res.status(500).json({ ok: false, msg: 'Error finalizando UserChallenge' });
    }
  };

// Eliminar un UserChallenge (p.ej. si aborta el reto)
 const deleteUserChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const borrado = await UserChallenge.findByIdAndDelete(id);
    if (!borrado) return res.status(404).json({ ok: false, msg: 'No existe UserChallenge' });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error eliminando UserChallenge' });
  }
};

module.exports = {
    createUserChallenge,
    getUserChallenges,
    getUserChallenge,
    updateUserChallenge,
    finishToday,
    deleteUserChallenge
  };