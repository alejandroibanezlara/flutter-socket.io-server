const { usuarioConectado, usuarioDesConectado, guardarMensaje } = require('../controllers/socket');
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');


//Mensajes de Sockets


io.on('connect',  (client) => {
    console.log('Cliente Conectado');

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    //Verificar token
    if(!valido) { 
        return client.disconnect(); 
    }
    

    //Cliente autenticado
    usuarioConectado( uid );

    //Ingresar al usuario a una sala en particular

    //sala global, client.id, 

    client.join(uid);

    //Escuchar del cliente el mensaej-personal
    client.on('mensaje-personal', async (payload) => {
        //Guardar mensaje en BBDD
        await guardarMensaje(payload);

        io.to( payload.para ).emit('mensaje-personal', payload);

    })

    // client.to(uid).emit('');


    
   //  console.log(bands)
    client.on('disconnect', () => { 
        usuarioDesConectado( uid );
        console.log('Cliente Desconectado')
     });


  });
