'use strict';

var express = require('express');
var logger = require('morgan');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var normalizeUrl = require('normalize-url');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


app.get('/', function(req, res) {
    res.send('Welcome To Site Up https://siteup.herokuapp.com/?url=$url&timeout=1000');
});

app.get('/siteup', function(req, res) {

    if (!req.query.url) {
        return res.send('missing url');
    } else {
        var checkurl = normalizeUrl(req.query.url);
    }

    var timeout = 10000;

    if (req.query.timeout) {
        timeout = req.query.timeout;
    }

    (function(response, url, timeout) {

        var options = {
            url: url,
            timeout: timeout
        };

        request(options, function(err, res) {
            if (!err) {
                if (response.statusCode === 200) {
                    response.sendFile('webonline.jpg', {
                        root: path.join(__dirname, '/public/img')
                    });
                } else {
                    response.sendFile('webdown.jpg', {
                        root: path.join(__dirname, '/public/img')
                    });
                }
            } else {
                response.sendFile('webdown.jpg', {
                    root: path.join(__dirname, '/public/img')
                });
            }
        });

    })(res, checkurl, timeout);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;