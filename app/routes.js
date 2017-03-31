/**
 * Created by arthurdearaujo on 3/9/17.
 */
// app/routes.js
const path = require('path');
const Tool = require('../app/models/tool');
const User = require('../app/models/user');
var collection = require("mongoose");

module.exports = function(app, passport) {


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/add-new-tool', function(req, res, done){

        // asynchronous
        process.nextTick(function() {
            Tool.findOne({ 'name' : req.query.toolName }, function(err, tool) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (tool) {
                    return done(null, tool); // tool found, return that tool
                } else {
                    // if there is no tool found with that tool name, create them
                    var newTool = new Tool();

                    newTool.name = req.query.toolName;
                    newTool.userCount = 1;
                    newTool.languages = req.query.toolLanguages;
                    console.log(newTool);

                    User.update({_id:req.user._id}, {$push: {
                        'local.tools': newTool
                    }}, function (err) {

                    });

                    newTool.save(function (err) {if (err)
                        throw err;

                        // if successful, return the new tool
                        return done(null, tool);
                    });
                }
            });
        });
    });

    app.get('/delete-tool', function(req, res, done){

        // asynchronous
        process.nextTick(function() {
            Tool.findOne({ 'name' : req.query.toolName }, function(err, tool) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);
                // if the tool is found, then remove it from user and update count
                if (tool) {
                    var newUserTools = [];
                    for(var i = 0; i < req.user.local.tools.length; i++){//Get new array without the delete tool
                        if(req.user.local.tools[i].name !== req.query.toolName){
                            newUserTools.push(req.user.local.tools[i]);
                        }
                    }

                    console.log(newUserTools);

                    User.update({_id:req.user._id}, {$set: {
                        'local.tools': newUserTools
                    }}, function (err) {

                    });

                    console.log('TOOL RANK: ' + tool.userCount);

                    Tool.update({_id:tool._id}, {$set: {
                        'userCount': tool.userCount - 1
                    }}, function (err) {

                    });

                    return done(null, tool); // tool found, return that tool
                } else {
                    return done(null);// tool not found
                }
            });
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['user_friends','email'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        console.log('User logged out');
        req.logout();
        res.redirect('/');
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('User is authenticated')
        return next();
    }
    console.log('User is already logged in')

    // if they aren't redirect them to the home page
    res.redirect('/');
    console.log(req.user)
}

