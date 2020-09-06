const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const dbConfig = require('./config/mongodb.config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connect mongoDB successfully!')
}).catch(err => {
  console.log('failded to connect mongoDB!' + err);
})
