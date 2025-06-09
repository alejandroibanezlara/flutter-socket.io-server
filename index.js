
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
app.use('/api/dailytask', require('./routes/dailytask'));
app.use('/api/routines', require('./routes/routines'));
app.use('/api/personalData', require('./routes/personalData'));
app.use('/api/objectives', require('./routes/objectives'));
app.use('/api/serInvencible', require('./routes/serinvencible'));
app.use('/api/microlearning', require('./routes/microlearning'));
app.use('/api/challenge', require('./routes/challenge'));
app.use('/api/user_challenge', require('./routes/user_challenge'));
app.use('/api/metaDataUser', require('./routes/metaDataUser'));
// Middleware personalizado para proteger la ruta de mantenimiento
app.use('/mantenimiento', (req, res, next) => {
    const token = req.query.token;
    if (token !== process.env.MANT) {
      return res.status(403).send('Acceso denegado: token incorrecto');
    }
    next();
  });
  
  // Servir la pantalla de mantenimiento
  app.use('/mantenimiento', express.static(path.join(__dirname, 'public/mantenimiento')));
//Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);


//Mensajes de Sockets
require('./sockets/socket');

//Calculo rutinas
// Calculo rutinas (reemplaza el try-catch existente)
require('./scripts/updateCacheDias')
    .run()
    .then(() => console.log('✅ Sistema de caché iniciado correctamente'))
    .catch((err) => console.error('❌ Error iniciando caché:', err));

const publicPath = path.resolve( __dirname, 'public' );

app.use( express.static(publicPath) );

server.listen(process.env.PORT, (err) => {
    if(err) throw new Error(err);

    console.log('Servidor corriendo en puerto', process.env.PORT);
})