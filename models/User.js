const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    pontos:{
        type: Number,
        required: true,
        default: 0.0
    },
    perguntasResolvidas:{ // adiciono no futuro uma var a ver quantas perguntas resolvidas/enviadas têm ???
        type: Array,
        required: true,
        "default": [] 
    },
    perguntasEnviadas:{
        type: Array,
        required: true,
        "default": [] 
    },
    dataCriacao:{
        type: Date
    }
});         // acabar isto depois !!!
/*
mydict = {"username": username,
"email": email,
"pontos": 0.0,
"perguntasResolvidas": [],  # para já vo trabalhar só com este
"perguntasEnviadas": [],  # este implemento lá para o fim ...
"dataCriacao": datetime.datetime.utcnow()
} */

// a DB do mongo ctfUsers
// db.users.insert( { nome: "martin@martin.com", pontos: 35 } )

const User = mongoose.model('User',UserSchema);

module.exports = User;