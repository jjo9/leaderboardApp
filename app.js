const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

// Connection to MongoDB
//Set up default mongoose connection
//var mongoDB = 'mongodb://127.0.0.1/ctfUsers';

// Mongo user that has access to database (users: jose/pedro)
var mongoDB = 'mongodb://pedro:passwordBoa321@127.0.0.1/ctfUsers';
//var mongoDB = 'mongodb://jose:umaPasswordMuitoBoa121@127.0.0.1/ctfUsers';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//ExpressJS and port
const app = express();
const PORT = process.env.PORT || 8081;

// public files (images)
app.use(express.static("public"));

// EJS
app.use(expressLayouts);
app.set('view engine','ejs');

// Routes
app.use('/', require('./routes/index'));

app.listen(PORT, console.log(`Server started on port ${PORT}`));

