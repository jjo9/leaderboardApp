const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');

// Mongo connection stuff
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/ctfUsers';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const app = express();
const PORT = process.env.PORT || 8081;

// EJS
app.use(expressLayouts);
app.set('view engine','ejs');

// Routes
app.use('/', require('./routes/index'));

app.listen(PORT, console.log(`Server started on port ${PORT}`));