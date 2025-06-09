/*

    path: api/routines

*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const Routine = require('../models/routine');

const { 
    crearRutina, 
    obtenerRutinasPorEstado, 
    actualizarRutina, 
    borrarRutina 
} = require('../controllers/routines');

const router = Router();

// Crear nueva rutina
router.post('/', validarJWT, crearRutina);

// Obtener rutinas por fecha
router.get('/', validarJWT, obtenerRutinasPorEstado);

// Actualizar rutina existente
router.put('/:routineId', validarJWT, actualizarRutina);

// Eliminar rutina (borrado lógico)
router.delete('/:routineId', validarJWT, borrarRutina);

router.post('/', async (req, res) => {
    const nuevaRutina = new Routine({
        ...req.body,
        reglasRepeticion: {
            tipo: req.body.tipo,
            diasSemana: req.body.diasSemana,
            diasMes:    req.body.diasMes,
            semanasMes: req.body.semanasMes,
            fechaFin: req.body.fechaFin
        }
    });

    
    await nuevaRutina.save(); // Se activará el pre-save hook
    res.status(201).json(nuevaRutina);
});




router.get('/:id/proximos-dias', async (req, res) => {
    const rutina = await Routine.findById(req.params.id);
    
    if (!rutina) return res.status(404).send();
    
    // Si el caché está vacío o es viejo, actualiza
    if (rutina.cacheDias.proximosDias.length < 5) {
        await rutina.actualizarCacheDias();
    }
    
    res.json(rutina.cacheDias.proximosDias);
});

module.exports = router;