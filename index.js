
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

//DB Config
require('./database/config').dbConnection();


//App de Express
const app = express();

// Lectura y parseo del Body
app.use(express.json());

// body-parser
app.use( bodyParser.urlencoded({extended: true}));

//Mis Rutas
app.use( '/api/login', require('./routes/auth'));
app.use( '/api/usuarios', require('./routes/usuarios'));
app.use( '/api/mensajes', require('./routes/mensajes'));
app.use( '/api/auth', require('./routes/auth'));


//Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);


//Mensajes de Sockets
require('./sockets/socket');

const publicPath = path.resolve( __dirname, 'public' );

app.use( express.static(publicPath) );

server.listen(process.env.PORT, (err) => {
    if(err) throw new Error(err);

    console.log('Servidor corriendo en puerto', process.env.PORT);
})