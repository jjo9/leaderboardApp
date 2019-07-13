const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    pontos:{
        type: Number,
        required: true,
        default: 0
    },
    resolvidos:{ // ponho este ?? vamos fazer com mongo ??
        type: Array,
        "default": [] 
    }
});

// a DB do mongo ctfUsers
// db.users.insert( { nome: "jose@jose.com", pontos: 20 } )

const User = mongoose.model('User',UserSchema);

module.exports = User;