/**
 * Created by arthurdearaujo on 3/20/17.
 */
// app/models/tool.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our tool model
var toolSchema = mongoose.Schema({
    iconURL      : String,
    name         : String,
    rank         : String,
    userCount    : Number,
    link         : String,
    languages    : []
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Tool', toolSchema);
