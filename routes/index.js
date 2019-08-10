const express = require('express');
const router = express.Router();
var Chart = require('chart.js'); // hahah no!

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

// Challange model
const Pergunta = require('../models/Pergunta');

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
// mostra Top 10 Users
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

// Mostra todos os Users

router.get('/findAllUsers',urlencodedParser ,function(req,res,next) {
    //console.log("username: "+req.body.username);
    User.find((err,tabela) => { // em vez de enviar tudo fazer query aqui !!
      if(err){
          next(err);
      } else {
          console.log(tabela);
          res.render('userInfo', {
              tabela
          });
      }
  });
  
});

// encontrar users

router.post('/findUser',urlencodedParser ,function(req,res,next) {
    //console.log("username: "+req.body.username);

    // por aqui um OR para poder encontrar o user por _ID

    if (req.body.username.match(/^[0-9a-fA-F]{24}$/)) {
        var que = { $or: [ { username:req.body.username}, {_id:req.body.username} ] }
    }else{
        var que = {username:req.body.username}
    }
    // db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )
    User.find( que ,(err,tabela) => { // em vez de enviar tudo fazer query aqui !!
      if(err){
          next(err);
      } else {
          console.log(tabela);
          res.render('userInfo', {
              tabela
          });
      }
  });
  
});


// encontrar Todos os Challanges

router.get('/findChallenges/:searchType/:searchText',urlencodedParser ,function(req,res,next) {
    console.log("tipo de procura: "+req.params.searchType);
    console.log("procura: "+req.params.searchText);
    queryType = {};
    if(req.params.searchType === "Categoria"){
        queryType = {Categoria:req.params.searchText};
    }else if(req.params.searchType === "Dificuldade"){
        queryType = {Dificuldade:req.params.searchText};
    }else if(req.params.searchType === "Pontos"){
        queryType = {Pontos:req.params.searchText};
    }else if(req.params.searchType === "usersQueResolveram"){
        //queryType = {:req.params.searchText};
    }
    Pergunta.find(queryType,(err,tabela) => { 
      if(err){
          next(err);
      } else {
          console.log(tabela);
          res.render('challangeInfo', {
              tabela
          });
      }
  });
  
});

module.exports = router;