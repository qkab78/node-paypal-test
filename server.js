require('dotenv').config();
const express = require('express');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.use('/', require('./routes/index-route'));

app.listen(port, () => console.log(`Server listening on port ${port}`))