const { response } = require("express");
const Usuario = require("../models/usuario");


const getUsuarios = async (req, res = response) => {
   
        const desde = Number(req.query.desde) || 0;
        //obtener el usuario por UID
        const usuarios = await Usuario
        .find({
            _id: { $ne: req.uid}
        })
        .sort('-online')
        .skip(desde)
        .limit(20)

        if( usuarios == [] ){
            return res.status(404).json({
                ok:false,
                msg: 'El usuario no está registradosss'
            });
        }

    
        res.json({
            ok: true,
            usuarios,
        });

}

module.exports = {
    getUsuarios
}