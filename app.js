const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081;

// Routes
app.use('/', require('./routes/index'));

app.listen(PORT, console.log(`Server started on port ${PORT}`));