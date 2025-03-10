const { io } = require('../index');


//Mensajes de Sockets


io.on('connect', client => {
    console.log('Cliente Conectado')
    
   //  console.log(bands)
    client.on('disconnect', () => { 
        console.log('Cliente Desconectado')
     });


  });
