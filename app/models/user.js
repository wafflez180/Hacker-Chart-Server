/**
 * Created by arthurdearaujo on 3/9/17.
 */
// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        filters      : {},
        tools        : {},
        friends      : {}
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        photoURL     : String,
        ageRangeMax  : String,
        gender       : String
    }
});

//  photos: [ { value: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/15977687_1576729562342021_2147369282711419588_n.jpg?oh=46d628b710a7a55a0cbbc5ec1b3280d6&oe=596A5AA2' } ],
//friends":{"data":[{"name":"Declan Hopkins","id":"628763470642184"}]

// checking if password is valid using bcrypt
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// this method hashes the password and sets the users password
userSchema.methods.hashPassword = function(password) {
    var user = this;

    // hash the password
    bcrypt.hash(password, null, null, function(err, hash) {
        if (err)
            return next(err);

        user.local.password = hash;
    });

};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
