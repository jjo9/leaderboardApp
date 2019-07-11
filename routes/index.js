const express = require('express');
const router = express.Router();
var Chart = require('chart.js');

//var mongo = require('mongodb').MongoClient;
//var objectId = require('mongodb').ObjectID;
//var assert = require('assert');

//var url = 'mongodb://localhost:27017/chartTeste';

// Telemovel model
//const Telemovel = require('../models/Telemovel');

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

router.get('/chartTesteMongo', function(req,res,next) {
    // o que tenho de fazer é ir buscar os telemoveis à BD !!!!!!
    //var resultArray = [];

      Telemovel.find((err,users) => {
        if(err){
            next(err);
        }else{
            //res.json(users);
            //resultArray = users.slice();
            //console.log(users);
            res.render('telemoveisAvendaSemLogin', {
                telemoveisV2: users
            });
        }
    });
    
});

module.exports = router;