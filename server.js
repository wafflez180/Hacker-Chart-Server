const express = require('express');
const path = require('path');
const routes = require(path.resolve(__dirname, 'app/routes.js'));
const passport = require('passport'); // pass passport for configuration;

const app = express();

var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var flash    = require('connect-flash');

var configDB = require('./config/database.js');

app.use('/static', express.static('static'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    var test = "test"

    res.render(path.resolve(__dirname, 'templates/hackerchart.ejs'), {
        test: test
    });

})

app.get('/welcome', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'templates/welcome.ejs'))
})
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})


// configuration ===============================================================
//mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

