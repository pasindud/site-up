var express = require('express');
var logger = require('morgan');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


app.get("/",function  (req,res) {
    res.send("Welcome To Site Up https://siteup.herokuapp.com/?url=$url&timeout=1000");
})

app.get("/siteup.png", function(req, res) {

    if (!req.query.url) {
        return res.send("missing url");
    }else{
        var url = req.query.url;
    }

    if (req.query.timeout) {
        var timeout = req.query.timeout;
    }else{
        var timeout = 10000;
    }

    (function(response,url,timeout) {

        var url = url;
        var options = {
            url: url,
            timeout: timeout
        };

        request(options, function(err) {
            if (!err) {
                response.sendFile('webonline.jpg', {
                    root: path.join(__dirname, '/public/img')
                });
            } else {
                response.sendFile('webdown.jpg', {
                    root: path.join(__dirname, '/public/img')
                });
            }
        });

    })(res,url,timeout);
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;