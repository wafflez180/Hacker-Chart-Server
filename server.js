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

// load up the user model
var User       = require('./app/models/user');
var Tool       = require('./app/models/tool');

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

    //TODOD THESE SORTING SHIT IS BAD AND IDK IF YOU SHOULD EVEN USE SORT NUMBER!
    //Rank all tools
    Tool.find({}).sort(sortNumber({userCount: 1})).exec(
        function(err, tools) {
            console.log(tools);
            sortedTools = tools;
            for(var i = sortedTools.length-1; i > 0; i--){
                var updatedCounter = sortedTools.length-1;
                Tool.update({_id:tools[i]._id}, {$set: {// Re-rank all the tools
                    'rank': i+1
                }}, function (err, results) {
                    updatedCounter--;
                    if(updatedCounter === 0) {// After last one is ranked, grab the top 50
                        //Get top 50 tools
                        var sortedTools = [];
                        Tool.find({}).sort(sortNumber({rank: -1})).limit(50).exec(
                            function (err, tools) {
                                sortedTools = tools;
                                if (req.user) {
                                    console.log("User is logged in");

                                    res.render(path.resolve(__dirname, 'views/hackerchart.ejs'), {
                                        loggedIn: true,
                                        filters: req.user.local.filters,
                                        tools: req.user.local.tools,
                                        friends: req.user.local.friends,
                                        textFieldInput: '',
                                        rankedTools: tools
                                    });
                                } else {
                                    console.log("User is not logged in");
                                    res.render(path.resolve(__dirname, 'views/hackerchart.ejs'), {
                                        loggedIn: false,
                                        filters: null,
                                        tools: null,
                                        friends: null,
                                        textFieldInput: null,
                                        rankedTools: tools
                                    });
                                }
                            }
                        );
                        console.log(sortedTools);
                    }
                });
            }
        }
    );
    function sortNumber(a,b) {
        return a - b;
    }
    function sortUserCountNum(a,b) {
        return a - b;
    }
});

app.get('/welcome', function (req, res) {
    res.render(path.resolve(__dirname, 'views/welcome.ejs'))
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

