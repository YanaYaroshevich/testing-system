'use strict'

var express = require('express');


var mongoose = require('mongoose');

var db = require('./db');

var security = require('./storm');
var stormpath = require('stormpath');

var cloudinary = require('cloudinary');
var cloudConfig = require('./cloud');


var client = null;
var appStormpath = null;
var keyfile = security.apiKeyFile;

var port = 8000;
var app = express();
mongoose.connect(db.url);
cloudinary.config(cloudConfig);

stormpath.loadApiKey(keyfile, function apiKeyFileLoaded(err, apiKey) {
    if (err) throw err;
    client = new stormpath.Client({apiKey: apiKey});
    
    client.getApplication(security.application, function(error, application) {
        if (error) throw error;
        appStormpath = application;
        app.listen(port);
    });
});


var kittySchema = mongoose.Schema({
    name: String
});
var Kitten = mongoose.model('Kitten', kittySchema);

var fluffy = new Kitten({ name: 'fluffy' });

fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
});