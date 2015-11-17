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

var port = 8080;
var app = express();

mongoose.connect(db.url);
var schemas = require('./shemas')(mongoose);

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

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

app.all('/*', function(req,res,next){
    res.set({
        'Access-Control-Allow-Origin':'*',
        "Access-Control-Allow-Methods":"PUT, DELETE, POST, GET, OPTIONS"
    });
    next();
});

var router = express.Router();

app.use(express.static(__dirname.substring(0, __dirname.lastIndexOf('\\')) + '\\app'));
app.set('views', __dirname.substring(0, __dirname.lastIndexOf('\\')) + '\\app');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');  

/* GET home page. */
router.get('/', function(req, res){
  res.render('index.html');
});

app.use('/', router);