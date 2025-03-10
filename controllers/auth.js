const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");


const crearUsuario = async (req, res = response) => {

    const {email, password } = req.body;

    try{

        const existeEmail = await Usuario.findOne({ email: email });

        if( existeEmail ){
            return res.status(400).json({
                ok:false,
                msg: 'El email ya está registrados'
            });
        }

        const usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);
    
        await usuario.save();

        // Generar mi JWT
        const token = await generarJWT(usuario.id);
    
        res.json({
            ok: true,
            usuario,
            token
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

}


const loginUsuario = async (req, res = response) => {

    const {email, password } = req.body;

    try{

        const usuarioDB = await Usuario.findOne({ email: email });

        if( !usuarioDB ){
            return res.status(404).json({
                ok:false,
                msg: 'El email no está registrados'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if( !validPassword ){
            return res.status(404).json({
                ok:false,
                msg: 'El pw no es OK'
            });
        }
        const token = await generarJWT(usuarioDB.id);
    
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

}

const renewToken = async(req, res = response) => {
    
    //uid
    const uid  = req.uid;

    // try{

        //generar jwt
        const token = await generarJWT(uid);

        //obtener el usuario por UID
        const usuario = await Usuario.findById(uid);

        if( !usuario ){
            return res.status(404).json({
                ok:false,
                msg: 'El usuario no está registradosss'
            });
        }

    
        res.json({
            ok: true,
            usuario,
            token
        });

    // }catch(error){
    //     console.log(error);
    //     res.status(500).json({
    //         ok:false,
    //         msg: 'Hable con el administrador'
    //     })
    // }



}

module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken,
}