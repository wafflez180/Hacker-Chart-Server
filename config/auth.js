/**
 * Created by arthurdearaujo on 3/9/17.
 */
// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
    'facebookAuth' : {
        'clientID'      : '141575826364573', // your App ID
        'clientSecret'  : '4fdb8fcec617542a4ec1da1e97b34326', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    }
};
