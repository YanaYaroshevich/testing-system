'use strict';

var express = require('express');
var stormpath = require('stormpath');
var mongoose = require('mongoose');
var cloudinary = require('cloudinary');
var bodyParser = require('body-parser');

var db = require('./db');
var security = require('./storm');
var cloudConfig = require('./cloud');
var schemas = require('./shemas')(mongoose);

var client = null;
var appStormpath = null;
var keyfile = security.apiKeyFile;

var port = 8080;
var app = express();

mongoose.connect(db.url);
cloudinary.config(cloudConfig);

var account = {};

var UserModel = mongoose.model('User', schemas.userSchema);
var QuestionModel = mongoose.model('Question', schemas.questionSchema);
var TestModel = mongoose.model('Test', schemas.testSchema);
var StudentTestModel = mongoose.model('StudentTest', schemas.studentTestSchema);

stormpath.loadApiKey(keyfile, function apiKeyFileLoaded(err, apiKey) {
    if (err) { throw err; }
    client = new stormpath.Client({apiKey: apiKey});
    
    client.getApplication(security.application, function (error, application) {
        if (error) { throw error; }
        appStormpath = application;
        app.listen(port);
        
        /*account = {
            username: 'admin',
            password: 'Qwertyuiop1',
            email: 'admin@admin.com',
            givenName: 'Admin',
            surname: 'Adminov',
            
            
        };
        
        var user = {
            login: account.username,
            password: account.password,
            email: account.email,
            firstName: account.givenName,
            lastName: account.surname,
            role: account.customData.role,
            picture: account.customData.picture,
            tests: account.customData.tests,
            studetns: account.customData.students,
            teachers: account.customData.teachers,
            group: account.group,
            course: account.customData.course
        };*/
        
        
        //var aaa = new UserModel(user);
        //aaa.save(function(err){if(err) console.log(err)});
        /*appStormpath.createAccount(account, function(err, account) {
          if (err) throw err;
        });*/
        
        /* appStormpath.getAccounts({email: 'admin@admin.com'}, function(err, accounts) {
            if (err) throw err;
            accounts.each(function (account, index) {
                console.log(account.givenName + " " + account.surname);
            });
        }); */
    });
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.all('/*', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Methods": "PUT, DELETE, POST, GET, OPTIONS"
    });
    next();
});

var router = express.Router();

var rootDir = __dirname.substring(0, __dirname.lastIndexOf('\\'));

app.use(express.static(rootDir + '\\app'));
app.set('views', rootDir + '\\app');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index.html');
});

router.post('/start', function (req, res) {
    appStormpath.authenticateAccount({
      username: req.body.email,
      password: req.body.password
    }, function (err, result) {
        if (err) {
            res.send({noErrors: false});
        }
        else {
            UserModel.findOne({email: result.account.email}, function (err, result_acc) {
                if(err) {
                    res.send({noErrors: false});
                }
                else {
                    res.send({account: result_acc, noErrors: true});
                }
            });
        }
    });
});
app.use('/', router);