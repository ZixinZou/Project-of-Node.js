var express = require('express');
var router = express.Router();
var user_m = require('../models/user');

// Aller directement à la page d'accueil
router.get('/', function(req, res, next) {
    res.render('index', { title: 'user' }); // Chargez le modèle index.ejs et transmettez les données au modèle.
});


// Aller à la page de connexion
router.get('/login', function(req, res, next) {
    res.render('login', {errmsg:''});
});

// Traitement des demandes de connexion
router.post('/login', function(req, res, next) {
    // console.log(req.body.username, req.body.password);
    var username = req.body.username || '',
        password = req.body.password || '';

    var password_hash = user_m.hash(password);

    user_m.login(username, password_hash, function(result){
        if(result.length){
            // console.log( req.session );
            req.session.user = {
                userid : result[0].id,
                username : username
            }
            res.redirect('/');
        }else{
            // console.log('Échec de la connexion');
            res.render('login', {errmsg:'Le nom d\'utilisateur ou le mot de passe est incorrect'});
        }
    });
});

// Afficher la page d'inscription
router.get('/reg', function(req, res, next){
    res.render('reg', {errmsg:''});// Charger le modèle reg.ejs
});

// Traitement des données d'enregistrement
router.post('/reg', function(req, res, next){
    var username = req.body.username || '',
        password = req.body.password || '',
        password2 = req.body.password2 || '';

    if(password!=password2){
        res.render('reg', {errmsg:'Mot de passe incohérent'});
        return;
    }
    var password_hash = user_m.hash(password),
        regtime = Date.now();
    user_m.reg(username, password_hash, regtime, function(result){
        if(result.isExisted){
            res.render('reg', {errmsg:'Nom d\'utilisateur déjà enregistré'});
        }else if(result.affectedRows){
            req.session.user = {
                userid  : result.insertId,
                username : username
            }
            res.redirect('/');
        }else{
            // console.log('Échec de la connexion');
            res.render('reg', {errmsg:'L\'enregistrement a échoué, veuillez réessayer'});
        }
    });
    // res.render('reg', {errmsg:''});
});

// Déconnexion
router.get('/logout', function(req, res, next){
    req.session.destroy();
    res.redirect('/user/login');
})

module.exports = router;
