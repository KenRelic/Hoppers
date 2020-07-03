const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const ejs = require('ejs');
require('dotenv/config');


// init
const app = express();

// IMPORT ROUTES
const pagesRoute = require('./routes/pages');
const adminRoute = require('./routes/auth');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// SET UP PULIC FOLDER
app.use(express.static('./public'));

// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


app.use('/', pagesRoute);
app.use('/auth', adminRoute);
app.use('/api', adminRoute);

const uri = process.env.DB_CONNECTION;
mongoose.connect(`${uri}`,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection not successful. [error]"));
db.once("open",()=>console.log("connection to DB successful"));



// MIDDLEWRAES
app.use(function(req, res, next){
    res.render('404');
    next();
})

// SERVER PORT
// to set an environment port value ==> set PORT=portNumber /// on the terminal
const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`server started at localhost:${port}`));
