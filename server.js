'use strict';

/**
 * Module dependencies.
 */

var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    nodemailer = require('nodemailer'),
    logger = require('mean-logger'),
    http = require('http'),
    sockjs = require('sockjs');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// Set the node environment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initializing system variables
var config = require('./config/config'),
    mongoose = require('mongoose');

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

// Bootstrap passport config
require('./config/passport')(passport);

var app = express();


// Set up sock.js
var sockjs_opts = {sockjs_url: 'http://cdn.sockjs.org/sockjs-0.3.min.js'};
var sockjs_echo = sockjs.createServer(sockjs_opts);


// Express settings
require('./config/express')(app, passport, db);

var port = config.port;
var server = http.createServer(app);

// Bootstrap routes
var routes_path = __dirname + '/app/routes';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath)(app, passport);
            }
        // We skip the app/routes/middlewares directory as it is meant to be
        // used and shared by routes as further middlewares and is not a
        // route by itself
        } else if (stat.isDirectory() && file !== 'middlewares') {
            walk(newPath);
        }
    });
};
walk(routes_path);


// var connections = [];
sockjs_echo.on('connection', function(conn) {
    // connections.push(conn);
    conn.on('data', function(message) {
        conn.write(message);
    });
    conn.on('close', function() {
        conn.write("User has disconnected");
    });
});

server.addListener('upgrade', function(req, res){
    res.end();
})

sockjs_echo.installHandlers(server, {prefix:'/echo'});
server.listen(port, '0.0.0.0');


// Initializing logger
logger.init(app, passport, mongoose);

// Expose app
exports = module.exports = app;
