// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', false);

// app.use(bodyParser.json());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(router);
app.use(errors());
app.use(error);
// app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
});
