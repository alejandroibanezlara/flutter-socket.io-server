const Microlearning = require('../models/Microlearning');

/**
 * Obtener 3 microlearnings aleatorios
 */
const getRandomMicrolearnings = async (req, res) => {
    
  try {

    const randomCards = await Microlearning.aggregate([
      { $sample: { size: 3 } }
    ]);
    res.status(200).json(randomCards);
  } catch (error) {
    console.error('Error al obtener microlearnings aleatorios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




const getAll = async (req, res) => {
  const items = await Microlearning.find();
  res.json(items);
};



const create = async (req, res) => {
  try {
    const { titulo, textoCorto, textoLargo, icono, imagen } = req.body;

    const nuevo = new Microlearning({
      titulo: req.body.titulo,
      textoCorto: req.body.textoCorto,
      textoLargo: req.body.textoLargo,
      icono: req.body.icono,
      imagen: req.body.imagen,
      areaInvencibleObj: req.body.areaInvencibleObj
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const actualizado = await Microlearning.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const eliminar = async (req, res) => {
  try {
    const eliminado = await Microlearning.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
    res.json({ msg: 'Eliminado correctamente' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getRandomMicrolearnings,
  getAll, create, update, eliminar
};