var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs'),
    filePond = require('filepond');

//new version START
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

var index = require('./routes/index');
var user = require('./routes/user');
var list = require('./routes/list');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'wenzi', // Une chaîne aléatoire de 128 caractères est recommandée
    cookie: { maxAge: 60*60*1000 },
    resave : false,
    saveUninitialized : true
}));

app.use(function(req, res, next){
    // S'il existe dans le cookie, cela signifie qu'il est déjà connecté.
    if( req.session.user ){
        res.locals.user = {
            userid : req.session.user.userid,
            username : req.session.user.username
        }
    }else{
        res.locals.user = {};
    }
    next();
})

app.use('/', index);
app.use('/user', user);
app.use('/list', list);

// Chargement de la page index.html
app.get('/talk', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });
});

server.listen(3030, () => {
    console.log('Application démarrée sur le port "http://127.0.0.1:3030" !')
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    //res.render('error');
});

module.exports = app;