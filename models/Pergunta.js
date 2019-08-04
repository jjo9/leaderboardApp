const mongoose = require('mongoose');

const PerguntaSchema = new mongoose.Schema({
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

const Pergunta = mongoose.model('Pergunta',PerguntaSchema);

module.exports = Pergunta;