const Routine = require('../models/routine');
const moment = require('moment');

const actualizarRutinasPendientes = async () => {
    const rutinas = await Routine.find({
        $or: [
            { 'cacheDias.ultimaActualizacion': { $lt: moment().subtract(3, 'days').toDate() } },
            { 'cacheDias.ultimaActualizacion': { $exists: false } }
        ]
    });
    
    for (const rutina of rutinas) {
        await rutina.actualizarCacheDias();
        console.log(`♻️ Actualizada caché para rutina: ${rutina.title}`);
    }
};

// Ejecución inmediata + programación diaria
module.exports = {
    run: async () => {
        await actualizarRutinasPendientes();
        
        // Opcional: Agrega aquí node-cron para ejecución diaria
        require('node-cron').schedule('0 4 * * *', () => {
            actualizarRutinasPendientes().catch(console.error);
        });
    }
};