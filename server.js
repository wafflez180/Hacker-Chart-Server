const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const routes = require(path.resolve(__dirname, 'app/routes.js'));
const passport = require('passport'); // pass passport for configuration;
const port     = process.env.PORT || 8080;
const mongoose = require('mongoose');
const flash    = require('connect-flash');
const configDB = require('./config/database.js');
const app = express();

app.use('/static', express.static('static'));
// set the view engine to ejs
app.set('view engine', 'ejs');

// set up our express application
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    var test = "test"

    res.render(path.resolve(__dirname, 'views/hackerchart.ejs'), {
        test: test
    });

})

app.get('/welcome', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'views/welcome.ejs'))
})
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

