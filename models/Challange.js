const mongoose = require('mongoose');

const ChallangeSchema = new mongoose.Schema({
    IDdesafio:{
        type: Number,
        required: true
    },
    Categoria:{
        type: String,
        required: true
    },
    Desafio:{
        type: String,
        required: true
    },
    Flag:{
        type: String,
        required: true
    },
    Pontos:{
        type: Number,
        required: true
    },
    usersQueResolveram:{
        type: Array,
        "default": [] 
    },
    dataCriacao:{
        type: Date
    }
});         // acabar isto depois !!!
/*
    # Schema dos desafios
    mydict = {"IDdesafio": idDesafio,  # inteiro
              "Categoria": categoria,  # string
              "Desafio": desafio,
              "Flag": flag,  # para já vo trabalhar só com este
              "Pontos": pontos,  # este implemento lá para o fim ... # inteiro
              "usersQueResolveram": [],
              "dataCriacao": datetime.datetime.utcnow()
              }
} */

// a DB do mongo ctfUsers
// db.users.insert( { nome: "martin@martin.com", pontos: 35 } )

const Challange = mongoose.model('Challange',ChallangeSchema);

module.exports = Challange;