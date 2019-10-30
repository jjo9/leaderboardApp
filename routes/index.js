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

//var async = require('async');

// User model
const User = require('../models/User');

// Challange model
const Pergunta = require('../models/Pergunta');

router.get('/', (req,res) => res.render('main'));
/* /// ----------------------------- descontinuado prque não vou usar isto vo fazer eu uma imagem
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
*/


// Mongo class -------

// leaderBoard Top 10
router.get('/leaderboardTop10', function(req,res,next) {
    User.find((err,tabela) => { // em vez de enviar tudo fazer query aqui !!
        //console.log(tabela);
        Pergunta.find((err,tabela2) => { // em vez de enviar tudo fazer query aqui !!
        //console.log(tabela2);
        pontosMaximos = 0;
        for(var x = 0; x < tabela2.length ;x++){
            //console.log(tabela2[x].Pontos);
            pontosMaximos = pontosMaximos + tabela2[x].Pontos;
        }
        if(err){
            next(err);
        } else {
            res.render('leaderTop10', {
                tabela,pontosMaximos
            });
        }
  })
  
  }).sort({ "pontos" : -1 }); 
});

// leaderBoard Global
router.get('/leaderboardGlobal', function(req,res,next) {
    User.find((err,tabela) => { // em vez de enviar tudo fazer query aqui !!
        //console.log(tabela);
        Pergunta.find((err,tabela2) => { // em vez de enviar tudo fazer query aqui !!
        //console.log(tabela2);
        pontosMaximos = 0;
        for(var x = 0; x < tabela2.length ;x++){
            //console.log(tabela2[x].Pontos);
            pontosMaximos = pontosMaximos + tabela2[x].Pontos;
        }
        if(err){
            next(err);
        } else {
            res.render('leaderGlobal', {
                tabela,pontosMaximos
            });
        }
  })
  
  }).sort({ "pontos" : -1 }); 
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

    if (req.body.username.match(/^[0-9a-fA-F]{24}$/)) {
        var que = { $or: [ { username:req.body.username}, {_id:req.body.username} ] }
    }else{
        var que = {username:req.body.username.trim()}
    }
    // db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )
    User.find( que ,(err,tabela) => { // em vez de enviar tudo fazer query aqui !!
      if(err){
          next(err);
      } else {
          console.log(tabela);
          res.render('userInfo', { // remover ctf{FLAG} antes de fazer render ????
              tabela
          });
      }
  });
  
});

// encontra desafios
router.post('/findChallenge',urlencodedParser ,function(req,res,next) {
    //console.log("username: "+req.body.username);

    if (req.body.username.match(/^[0-9a-fA-F]{24}$/)) {
        var que = { $or: [ { username:req.body.username}, {_id:req.body.username} ] }
    }else{
        var que = {username:req.body.username.trim()}
    }
    // db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )
    Pergunta.find( que ,(err,tabela) => { // em vez de enviar tudo fazer query aqui !!
      if(err){
          next(err);
      } else {
        (async() => { // that async thing begin >>>>>>
            for(var i = 0;i < tabela.length;i++){
                //console.log(tabela[i].Autor);
                var aaa = await id2username(tabela[i].Autor); // podia juntalas mas faço isso depois !!
                tabela[i].AutorUsername = aaa;
                for(var ii = 0;ii < tabela[i].usersQueResolveram.length;ii++){
                    var aaai = await id2username(tabela[i].usersQueResolveram[ii].userID);
                    console.log(">>>",aaai);
                    tabela[i].usersQueResolveram[ii].userID2 = aaai;
                }
              }

          res.render('challangeInfoOne', {
              tabela
          });

          })(); // that async thing ending <<<<<<

          // console.log(tabela);
          // res.render('challangeInfo', { // remover ctf{FLAG} antes de fazer render ????
          //     tabela
          // });
      }
  });
  
});

// Ver lista completa de Users que resolveram um determinado desafio

router.post('/listaCompletaUserQueResolveram',urlencodedParser ,function(req,res,next) {
    //console.log("username: "+req.body.username);

    var que = {IDdesafio:req.body.IDdesafio.trim()}

    Pergunta.find( que ,(err,tabela) => { // em vez de enviar tudo fazer query aqui !!
      if(err){
          next(err);
      } else {
        (async() => { // that async thing begin >>>>>>
            for(var i = 0;i < tabela.length;i++){
                //console.log(tabela[i].Autor);
                var aaa = await id2username(tabela[i].Autor); // podia juntalas mas faço isso depois !!
                tabela[i].AutorUsername = aaa;
                for(var ii = 0;ii < tabela[i].usersQueResolveram.length;ii++){
                    var aaai = await id2username(tabela[i].usersQueResolveram[ii].userID);
                    console.log(">>>",aaai);
                    tabela[i].usersQueResolveram[ii].userID2 = aaai;
                }
              }

          res.render('listaCompletaUserQueResolveram', {
              tabela
          });

          })(); // that async thing ending <<<<<<

          // console.log(tabela);
          // res.render('listaCompletaUserQueResolveram', { // remover ctf{FLAG} antes de fazer render ????
          //     tabela
          // });
      }
  });
  



});

// mostra perguntas enviadas / resolvidas de um determinado User

// id to perguntaTitulo
async function id2perguntaTitulo(ID) {    // tenh que deixar o user procurar por pergunta ?? primeiro tenho que o por a ver o titulo das perguntas
    return new Promise(function(resolve, reject) {
        Pergunta.findById(ID,(err,tabela2) => {
            //console.log(tabela2.username);
            //console.log("-------",tabela2.DesafioTitulo);
            if(tabela2 != null){
                if(tabela2.DesafioTitulo != undefined){
                    resolve(tabela2.DesafioTitulo);
                }else{
                    resolve(false);
                }
            }else{
                resolve(false);
            }
            
        });
    })
 } 


router.get('/userPerguntasInfo/:userId/:tipoPergunta',urlencodedParser ,function(req,res,next) {

    var que = { _id:req.params.userId };
    User.find( que ,(err,tabela) => {
      if(err){
          next(err);
      } else {
          (async() => { // that async thing begin >>>>>>

            if(req.params.tipoPergunta == "perguntasResolvidas"){
                for(var ii = 0;ii < tabela[0].perguntasResolvidas.length;ii++){
                    var tituloNovo = await id2perguntaTitulo(tabela[0].perguntasResolvidas[ii].perguntaID);
                    tabela[0].perguntasResolvidas[ii].perguntaID2 = tituloNovo;
                }
            }else{
                for(var ii = 0;ii < tabela[0].perguntasEnviadas.length;ii++){
                    var tituloNovo = await id2perguntaTitulo(tabela[0].perguntasEnviadas[ii].perguntaID);
                    tabela[0].perguntasEnviadas[ii].perguntaID2 = tituloNovo;
                }
            }

            if(req.params.tipoPergunta == "perguntasResolvidas"){
                res.render('challangeInfoRes', {
                    tabela
                });
            }else{
                res.render('challangeInfoEnv', {
                    tabela
                });
            }

          })(); // that async thing ending <<<<<<

      }
  });
  
});



// id to username 
async function id2username(ID) { 
    return new Promise(function(resolve, reject) {
        User.findById(ID,(err,tabela2) => {
            //console.log(tabela2.username);
            //console.log("-------",tabela2.username);
            if(tabela2 == undefined){
                resolve(false);
            }else{
                if(tabela2.username != undefined && tabela2.username != null){
                    resolve(tabela2.username);
                }else{
                    resolve(false);
                }
            }
        });
    })
 } 

// encontrar Todos os Challanges

router.get('/findChallenges/:searchType/:searchText',urlencodedParser ,function(req,res,next) {
    console.log("tipo de procura: "+req.params.searchType);
    console.log("procura: "+req.params.searchText);
    queryType = {};
    var numSort = 1;
    var sort = {};
    if(req.params.searchType === "Categoria"){
        queryType = {Categoria:req.params.searchText};
    }else if(req.params.searchType === "Dificuldade"){
        queryType = {Dificuldade:req.params.searchText};
    }else if(req.params.searchType === "Pontos"){
        // queryType = {Pontos:req.params.searchText};
        if(req.params.searchText === "Alta"){
            numSort = -1;
        }else{
            numSort = 1;
        }
        sort = { "Pontos" : numSort };
    }else if(req.params.searchType === "usersQueResolveram"){
        //queryType = {:req.params.searchText};
        if(req.params.searchText === "Alta"){
            numSort = -1;
        }else{
            numSort = 1;
        }
        sort = { "usersQueResolveram_size" : numSort };
    }else if(req.params.searchType === "Data"){
        //queryType = {:req.params.searchText};
        if(req.params.searchText === "Antigo"){
            numSort = -1;
        }else{
            numSort = 1;
        }
        sort = { "dataCriacao" : numSort };
    }else if(req.params.searchType === "Rating"){
        //queryType = {:req.params.searchText};
        if(req.params.searchText === "Alto"){
            numSort = -1;
        }else{
            numSort = 1;
        }
        sort = { "ratingScore" : numSort };
    }
    Pergunta.find(queryType,(err,tabela) => { 
      if(err){
          next(err);
      } else {
        //var uuu = [];

          //console.log(tabela); // antes de fazer o render por o USERNAME EM vez do ID !
          // ou acrescentar até que assim com o id vai direto para o findUsers!!! <- fiz este aqui !!

          (async() => { // that async thing begin >>>>>>
            for(var i = 0;i < tabela.length;i++){
                //console.log(tabela[i].Autor);
                var aaa = await id2username(tabela[i].Autor); // podia juntalas mas faço isso depois !!
                tabela[i].AutorUsername = aaa;
                for(var ii = 0;ii < tabela[i].usersQueResolveram.length;ii++){
                    var aaai = await id2username(tabela[i].usersQueResolveram[ii].userID);
                    console.log(">>>",aaai);
                    tabela[i].usersQueResolveram[ii].userID2 = aaai;
                }
              }

          res.render('challangeInfo', {
              tabela
          });

          })(); // that async thing ending <<<<<<
          
      }
  }).sort(sort).then(console.log("end thingy"));
  
});

// redireciona para a pagina que ensina a jogar

router.get('/how2play',function(req,res,next) {
    res.render('how2play');
})

router.get('/guideLines',function(req,res,next) {
    res.render('guideLines');
})

// pagina sobre a historia do site ...

router.get('/About',function(req,res,next) {
    res.render('about');
})

module.exports = router;