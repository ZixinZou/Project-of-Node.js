var express = require('express');
var router = express.Router();

/* GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/
var list_m = require('../models/list');

router.get('/', function(req, res, next) {
    list_m.getIndexList(function(result){
        res.render('index', { data:result }); // Sélectionnez le modèle d'index et transmettez les données
    })
});
module.exports = router;
