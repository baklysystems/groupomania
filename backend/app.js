const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
var mysql = require ('mysql');
//var sqlite3 = require ('sqlite3');
var expressValidator = require ('express-validator');
var expressSession = require ('express-session');
const session = require('express-session');
const app = express();
const path = require('path');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require ('./src/middleware/auth')

const userCtrl = require('./src/controllers/user')
const notificationsCtrl = require('./src/controllers/notifications')

const postsRoutes = require('./src/routes/posts')
const userRoutes = require('./src/routes/user')


var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

app.use(bodyParser.json())

var connection =mysql.createConnection({
    //properties
    host: '69.164.217.96',
    user: 'groupomania',
    password: 'groupomania',
    database: 'groupomania'
});

connection.connect(function(error) {
//callback for when connected and there is error
    if(!!error) {
        console.log(error);
    } else {
        console.log('Connected');
    }
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/posts', postsRoutes)
app.use('/api/auth', userRoutes)

app.get('/api/users/:id', auth, userCtrl.getOneUser)
app.get('/api/users', auth, userCtrl.getAllUsers)
app.delete('/api/users/:id', auth, userCtrl.deleteUserAccount)

app.get('/api/notifications/:id', auth, notificationsCtrl.getNotificationsOfOneUser)
app.delete('/api/notifications/:id', auth, notificationsCtrl.deleteNotification)

module.exports = app