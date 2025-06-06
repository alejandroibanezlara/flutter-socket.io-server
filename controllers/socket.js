const Mensaje = require('../models/mensaje');
const Usuario = require('../models/usuario');


const usuarioConectado = async ( uid = '') =>{

    const usuario = await Usuario.findById( uid );

    usuario.online = true;

    await usuario.save();

    return usuario;

}

const usuarioDesConectado = async ( uid = '') =>{

    const usuario = await Usuario.findById( uid );

    usuario.online = false;

    await usuario.save();

    return usuario;

}

const guardarMensaje = async(payload) => {

    /*
        {
            de: '',
            para: '',
            mensaje: '',
        }
    */

    try{
        const mensaje = new Mensaje(payload);
        await mensaje.save();
        return true;
    }catch (error) {
        return false;
    }
}


module.exports = {
    usuarioConectado,
    usuarioDesConectado,
    guardarMensaje
}