const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '63a3529c9b8f9a7c9479cc55',
  };

  next();
});
/*
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
*/
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
});
