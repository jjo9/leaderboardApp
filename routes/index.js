const express = require('express');
const router = express.Router();
var Chart = require('chart.js');

var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/ctfUsers';

// para poder acessar ao que é enviado dentro do POST
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// User model
const User = require('../models/User');

router.get('/', (req,res) => res.render('main'));

router.get('/chartTesteHard', function(req,res,next) {
    
    var info = {
        telemoveis:[
            {nomeMarca:'Xiaomi'},
            {nomeMarca:'Apple'},
            {nomeMarca:'Samsung'}
        ]
    };
    res.render('chartTesteV1',info);  
});

router.get('/leaderBoardTesteHard', function(req,res,next) { 
    var info = {
        tabela:[
            {nome:'jose@jose.com',
            pontos:20},
            {nome:'pedro@pedro.com',
            pontos:10},
            {nome:'martin@martin.com',
            pontos:25},
            {nome:'123@gmail.com',
            pontos:30},
            {nome:'marcos@martin.com',
            pontos:5},
            {nome:'silveira@martin.com',
            pontos:0},
            {nome:'david@martin.com',
            pontos:0},
            {nome:'mario@martin.com',
            pontos:25},
            {nome:'browser@martin.com',
            pontos:25},
            {nome:'peach@martin.com',
            pontos:33}
        ]
    };
    res.render('leaderTestV1',info);  
});

// Mongo class -------

router.get('/leaderboardTesteMongo', function(req,res,next) {

      User.find((err,tabela) => { // em vez de enviar tudo fazer query aqui !!
        if(err){
            next(err);
        } else {
            res.render('leaderTestV1', {
                tabela
            });
        }
    });
    
});

// novo modo de fazer querys, antes eu fazia com o ejs para ver o top 5 agora procuro no mongo apenas o top 5

router.get('/mongoNewQueryTeste', function(req,res,next) {
    
    //User.find({pontos:{"$gte": 30.0}},(err,tabela) => { // em vez de enviar tudo fazer query aqui !!

    User.find((err,tabela) => { // em vez de enviar tudo fazer query aqui !!
      if(err){
          next(err);
      } else {
          console.log(tabela);
          res.render('leaderTestV1', {
              tabela
          });
      }
  }).sort({ pontos: -1 }).limit(10);
  
});


// encontrar users

router.post('/findUser',urlencodedParser ,function(req,res,next) {
    //console.log("username: "+req.body.username);
    User.find({username:req.body.username},(err,tabela) => { // em vez de enviar tudo fazer query aqui !!
      if(err){
          next(err);
      } else {
          //console.log(tabela);
          res.render('userInfo', {
              tabela
          });
      }
  });
  
});


module.exports = router;