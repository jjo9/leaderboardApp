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
    ratingVotes:{
        type: Array,
        required: true,
        "default": [] 
    },
    ratingScore:{ // percentagem de "Yes" 
        type: Number,
        required: true,
        "default": 0
    },
    Autor:{ // este vai ter o ID
        type: String, 
        required: true
    },
    AutorUsername:{ // este vai ter o username mas só o vou buscar na altura da query, isto não está na base de dados
        type: String,
        required: false,
        strict: false
    },
    dataCriacao:{
        required: true,
        type: Date
    }
});     

const Pergunta = mongoose.model('Pergunta',PerguntaSchema);

module.exports = Pergunta;