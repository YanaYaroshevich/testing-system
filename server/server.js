var express = require('express');
var mongoose = require('mongoose');
var db = require('db');
var security = require('storm');
var cloudinary = require('cloudinary');
var cloudConfig = require('cloud');
var stormpath = require('stormpath');
var client = null;
var appStormpath = null;
var keyfile = security.apiKeyFile;
var app = express();
var port = 8000;

mongoose.connect(db.url);
cloudinary.config(cloudConfig);

stormpath.loadApiKey(keyfile, function apiKeyFileLoaded(err, apiKey) {
    if (err) throw err;
    client = new stormpath.Client({apiKey: apiKey});
    
    client.getApplication(security.application ,function(error, application) {
        if (error) throw error;
        appStormpath = application;
        app.listen(port);
        
    });
});