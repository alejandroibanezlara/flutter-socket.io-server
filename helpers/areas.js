// helpers/areas.js
const areasDisponibles = [
    {
        titulo: 'Empatía y Solidaridad',
        icono: 'group'
    },
    {
        titulo: 'Carisma',
        icono: 'face'
    },
    {
        titulo: 'Disciplina',
        icono: 'check'
    },
    {
        titulo: 'Organización',
        icono: 'assignment'
    },
    {
        titulo: 'Adaptabilidad',
        icono: 'autorenew'
    },
    {
        titulo: 'Imagen pulida',
        icono: 'image'
    },
    {
        titulo: 'Visión estratégica',
        icono: 'visibility'
    },
    {
        titulo: 'Educación financiera',
        icono: 'money'
    },
    {
        titulo: 'Actitud de superación',
        icono: 'trending_up'
    },
    {
        titulo: 'Comunicación asertiva',
        icono: 'chat'
    }
];

module.exports = {
    obtenerTodasLasAreas: () => areasDisponibles,
    validarArea: (area) => {
        return areasDisponibles.some(a => 
            a.titulo === area.titulo && a.icono === area.icono
        );
    }
};