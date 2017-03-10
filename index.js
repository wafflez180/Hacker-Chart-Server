const express = require('express');
const path = require('path');

const app = express();

app.use('/static', express.static('static'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    var test = "test"

    res.render(path.resolve(__dirname, 'templates/hackerchart'), {
        test: test
    });

})

app.get('/welcome', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'templates/welcome'))
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

