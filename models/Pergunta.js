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
    Dificuldade:{
        type: Number,
        required: true
    },
    Recursos:{
        type: String,
        required: true
    },
    DesafioTitulo:{
        type: String,
        required: true
    },
    DesafioDescricao:{
        type: String,
        required: true
    },
    hint:{
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
    usersQueResolveram_size:{
        type: Number,
        required: true,
        "default": 0
    },
    usersQueResolveram:{
        type: Array,
        required: true,
        "default": [] 
    },
    Autor:{
        type: String,
        required: true
    },
    dataCriacao:{
        required: true,
        type: Date
    }
});     

const Pergunta = mongoose.model('Pergunta',PerguntaSchema);

module.exports = Pergunta;