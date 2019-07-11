const express = require('express');
const expressLayouts = require('express-ejs-layouts');

// const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8081;

// Mongo connection stuff


// EJS
app.use(expressLayouts);
app.set('view engine','ejs');

// Routes
app.use('/', require('./routes/index'));

app.listen(PORT, console.log(`Server started on port ${PORT}`));