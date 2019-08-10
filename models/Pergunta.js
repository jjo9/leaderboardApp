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
    usersQueResolveram:{
        type: Array,
        "default": [] 
    },
    Autor:{
        type: String,
        required: true
    },
    dataCriacao:{
        type: Date
    }
});     

const Pergunta = mongoose.model('Pergunta',PerguntaSchema);

module.exports = Pergunta;