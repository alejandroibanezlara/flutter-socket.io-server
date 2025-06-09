// Función para calcular los próximos 50 días según el tipo de rutina
function calcularDiasFuturos(routine) {
    const diasFuturos = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (routine.tipo === 'semanal' && routine.diasSemana && routine.diasSemana.length > 0) {
        // Lógica para rutinas semanales
        let diasAgregados = 0;
        let diasCalculados = 0;
        const maxDiasCalculados = 500; // Límite para evitar bucles infinitos
        
        while (diasAgregados < 50 && diasCalculados < maxDiasCalculados) {
            for (const diaSemana of routine.diasSemana) {
                const fecha = new Date(hoy);
                fecha.setDate(fecha.getDate() + diasCalculados);
                
                const iso = fecha.getDay() === 0 ? 7 : fecha.getDay();
                if (iso === diaSemana && fecha > hoy){
                // if (fecha.getDay() === diaSemana && fecha > hoy) {
                    diasFuturos.push(new Date(fecha));
                    diasAgregados++;
                    if (diasAgregados >= 50) break;
                }
            }
            diasCalculados++;
        }
    } else if (routine.tipo === 'mensual' && routine.diasMes && routine.diasMes.length > 0) {
        // Lógica para rutinas mensuales
        let mesesAgregados = 0;
        let diasAgregados = 0;
        
        while (diasAgregados < 50) {
            for (const diaMes of routine.diasMes) {
                const fecha = new Date(hoy);
                fecha.setMonth(fecha.getMonth() + mesesAgregados);
                
                // Ajustar para meses que no tienen el día especificado
                const ultimoDiaMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
                const diaReal = Math.min(diaMes, ultimoDiaMes);
                
                fecha.setDate(diaReal);
                
                if (fecha > hoy) {
                    diasFuturos.push(new Date(fecha));
                    diasAgregados++;
                    if (diasAgregados >= 50) break;
                }
            }
            mesesAgregados++;
        }
    } else if (routine.tipo === 'personalizada') {
        // Lógica para rutinas personalizadas (aquí podrías agregar tu propia lógica)
        for (let i = 1; i <= 50; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(fecha.getDate() + i);
            diasFuturos.push(new Date(fecha));
        }
    }
    
    return diasFuturos.slice(0, 50); // Asegurar que solo devuelva 50 días
}

module.exports = { calcularDiasFuturos }; 