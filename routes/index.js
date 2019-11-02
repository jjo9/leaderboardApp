const express = require('express');
const router = express.Router();

var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

//Mongo Connection
var url = 'mongodb://localhost:27017/ctfUsers';

// to get acess to the information sent inside POST
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Models
const User = require('../models/User'); //User Model
const Pergunta = require('../models/Pergunta'); //Challenge Model

//Main page
router.get('/', (req, res) => res.render('main'));

// leaderBoard Top 10
router.get('/leaderboardTop10', function (req, res, next) {
    User.find((err, tabela) => {
        Pergunta.find((err, tabela2) => {
            //Query
            pontosMaximos = 0;
            for (var x = 0; x < tabela2.length; x++) {
                pontosMaximos = pontosMaximos + tabela2[x].Pontos;
            }
            if (err) {
                next(err);
            } else {
                res.render('leaderTop10', {
                    tabela, pontosMaximos
                });
            }
        })
    }).sort({ "pontos": -1 });
});

// leaderBoard Global
router.get('/leaderboardGlobal', function (req, res, next) {
    User.find((err, tabela) => {
        Pergunta.find((err, tabela2) => {
            //Query
            pontosMaximos = 0;
            for (var x = 0; x < tabela2.length; x++) {
                pontosMaximos = pontosMaximos + tabela2[x].Pontos;
            }
            if (err) {
                next(err);
            } else {
                res.render('leaderGlobal', {
                    tabela, pontosMaximos
                });
            }
        })
    }).sort({ "pontos": -1 });
});


// novo modo de fazer querys, antes eu fazia com o ejs para ver o top 5 agora procuro no mongo apenas o top 5
// mostra Top 10 Users
router.get('/mongoNewQueryTeste', function (req, res, next) {

    //User.find({pontos:{"$gte": 30.0}},(err,tabela) => { // em vez de enviar tudo fazer query aqui !!

    User.find((err, tabela) => { // em vez de enviar tudo fazer query aqui !!
        if (err) {
            next(err);
        } else {
            console.log(tabela);
            res.render('leaderTestV1', {
                tabela
            });
        }
    }).sort({ pontos: -1 }).limit(10);

});

// Shows all users
router.get('/findAllUsers', urlencodedParser, function (req, res, next) {

    User.find((err, tabela) => {
        //Query
        if (err) {
            next(err);
        } else {
            console.log(tabela);
            res.render('userInfo', {
                tabela
            });
        }
    });
});


// Find users
router.post('/findUser', urlencodedParser, function (req, res, next) {
    if (req.body.username.match(/^[0-9a-fA-F]{24}$/)) {
        var que = { $or: [{ username: req.body.username }, { _id: req.body.username }] }
    } else {
        var que = { username: req.body.username.trim() }
    }
    User.find(que, (err, tabela) => {
        //Query
        if (err) {
            next(err);
        } else {
            console.log(tabela);
            res.render('userInfo', {
                tabela
            });
        }
    });
});

// Find challenges
router.post('/findChallenge', urlencodedParser, function (req, res, next) {
    if (req.body.username.match(/^[0-9a-fA-F]{24}$/)) {
        var que = { $or: [{ username: req.body.username }, { _id: req.body.username }] }
    } else {
        var que = { username: req.body.username.trim() }
    }
    Pergunta.find(que, (err, tabela) => {
        //Query
        if (err) {
            next(err);
        } else {
            (async () => { // async function begins here >>>>>>
                for (var i = 0; i < tabela.length; i++) {
                    var aaa = await id2username(tabela[i].Autor); // podia juntalas mas faço isso depois !!
                    tabela[i].AutorUsername = aaa;
                    for (var ii = 0; ii < tabela[i].usersQueResolveram.length; ii++) {
                        var aaai = await id2username(tabela[i].usersQueResolveram[ii].userID);
                        console.log(">>>", aaai);
                        tabela[i].usersQueResolveram[ii].userID2 = aaai;
                    }
                }

                res.render('challangeInfoOne', {
                    tabela
                });

            })(); // async function ends here <<<<<<

            // console.log(tabela);
            // res.render('challangeInfo', { // remover ctf{FLAG} antes de fazer render ????
            //     tabela
            // });
        }
    });

});

// See the full list of users that solved a specific challenge
router.post('/listaCompletaUserQueResolveram', urlencodedParser, function (req, res, next) {
    var que = { IDdesafio: req.body.IDdesafio.trim() }
    Pergunta.find(que, (err, tabela) => {
        //Query
        if (err) {
            next(err);
        } else {
            (async () => { // async function begins here >>>>>>
                for (var i = 0; i < tabela.length; i++) {
                    //console.log(tabela[i].Autor);
                    var aaa = await id2username(tabela[i].Autor); // podia juntalas mas faço isso depois !!
                    tabela[i].AutorUsername = aaa;
                    for (var ii = 0; ii < tabela[i].usersQueResolveram.length; ii++) {
                        var aaai = await id2username(tabela[i].usersQueResolveram[ii].userID);
                        console.log(">>>", aaai);
                        tabela[i].usersQueResolveram[ii].userID2 = aaai;
                    }
                }

                res.render('listaCompletaUserQueResolveram', {
                    tabela
                });

            })(); // async function ends here <<<<<<
        }
    });




});

//Show questions that have been sent/solved by a certain User
// QuestionID
async function id2perguntaTitulo(ID) {
    return new Promise(function (resolve, reject) {
        Pergunta.findById(ID, (err, tabela2) => {
            if (tabela2 != null) {
                if (tabela2.DesafioTitulo != undefined) {
                    resolve(tabela2.DesafioTitulo);
                } else {
                    resolve(false);
                }
            } else {
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

// ID to Username 
async function id2username(ID) {
    return new Promise(function (resolve, reject) {
        User.findById(ID, (err, tabela2) => {
            if (tabela2 == undefined) {
                resolve(false);
            } else {
                if (tabela2.username != undefined && tabela2.username != null) {
                    resolve(tabela2.username);
                } else {
                    resolve(false);
                }
            }
        });
    })
}

// Find all challenges
router.get('/findChallenges/:searchType/:searchText', urlencodedParser, function (req, res, next) {
    console.log("tipo de procura: " + req.params.searchType);
    console.log("procura: " + req.params.searchText);
    queryType = {};
    var numSort = 1;
    var sort = {};
    if (req.params.searchType === "Categoria") {
        queryType = { Categoria: req.params.searchText };
    } else if (req.params.searchType === "Dificuldade") {
        queryType = { Dificuldade: req.params.searchText };
    } else if (req.params.searchType === "Pontos") {
        // queryType = {Pontos:req.params.searchText};
        if (req.params.searchText === "Alta") {
            numSort = -1;
        } else {
            numSort = 1;
        }
        sort = { "Pontos": numSort };
    } else if (req.params.searchType === "usersQueResolveram") {
        //queryType = {:req.params.searchText};
        if (req.params.searchText === "Alta") {
            numSort = -1;
        } else {
            numSort = 1;
        }
        sort = { "usersQueResolveram_size": numSort };
    } else if (req.params.searchType === "Data") {
        //queryType = {:req.params.searchText};
        if (req.params.searchText === "Antigo") {
            numSort = -1;
        } else {
            numSort = 1;
        }
        sort = { "dataCriacao": numSort };
    } else if (req.params.searchType === "Rating") {
        //queryType = {:req.params.searchText};
        if (req.params.searchText === "Alto") {
            numSort = -1;
        } else {
            numSort = 1;
        }
        sort = { "ratingScore": numSort };
    }
    Pergunta.find(queryType, (err, tabela) => {
        if (err) {
            next(err);
        } else {
            //console.log(tabela); // antes de fazer o render por o USERNAME EM vez do ID !
            // ou acrescentar até que assim com o id vai direto para o findUsers!!! <- fiz este aqui !!
            //The ID is switched to Username because the  
            (async () => { // async function begins here >>>>>>
                for (var i = 0; i < tabela.length; i++) {
                    var aaa = await id2username(tabela[i].Autor);
                    tabela[i].AutorUsername = aaa;
                    for (var ii = 0; ii < tabela[i].usersQueResolveram.length; ii++) {
                        var aaai = await id2username(tabela[i].usersQueResolveram[ii].userID);
                        console.log(">>>", aaai);
                        tabela[i].usersQueResolveram[ii].userID2 = aaai;
                    }
                }
                res.render('challangeInfo', {
                    tabela
                });
            })(); // async function ends here <<<<<<
        }
    }).sort(sort).then(console.log("end thingy"));
});

//Redirects to the page that teaches how to play in the platform
router.get('/how2play', function (req, res, next) {
    res.render('how2play');
})

//GuideLines page to propose new challenges
router.get('/guideLines', function (req, res, next) {
    res.render('guideLines');
})

//Page telling more about the platform
router.get('/About', function (req, res, next) {
    res.render('about');
})

module.exports = router;