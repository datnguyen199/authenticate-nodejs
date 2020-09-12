require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const dbConfig = require('./config/mongodb.config');
const mongoose = require('mongoose');
const router = require('./router/router');
const PORT = process.env.PORT || 8080

app.use('/', router);
const Role = require('./model/role');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connect mongoDB successfully!')
  initial();
}).catch(err => {
  console.log('failded to connect mongoDB!' + err);
})

var server = app.listen(PORT, function () {
  var host = server.address().address

  console.log("App listening at http://%s:%s", host, PORT);
})


function initial(){
  Role.count( (err, count) => {
    if(!err && count === 0) {
      new Role({
        name: 'user'
      }).save( err => {
        if(err) return console.error(err.stack)
        console.log("USER_ROLE is added")
      });

      new Role({
        name: 'admin'
      }).save( err => {
        if(err) return console.error(err.stack)
        console.log("ADMIN_ROLE is added")
      });

      new Role({
        name: 'super_admin'
      }).save(err => {
        if(err) return console.error(err.stack)
        console.log("SUPER_ADMIN_ROLE is added")
      });
    }
  });
}
