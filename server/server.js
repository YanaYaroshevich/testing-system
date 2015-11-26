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
var NewsModel = mongoose.model('NewsModel', schemas.newsSchema);

stormpath.loadApiKey(keyfile, function apiKeyFileLoaded(err, apiKey) {
    if (err) { throw err; }
    client = new stormpath.Client({apiKey: apiKey});
    
    client.getApplication(security.application, function (error, application) {
        if (error) { throw error; }
        appStormpath = application;
        app.listen(port);
        
       
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
    res.redirect('/start');
});
router.get('/start', function (req, res) {
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

router.get('/main/:userId/news', function (req, res) {
    NewsModel.find({userId: req.params.userId}, function (err, result_news) {
        if (err) {
            res.status(err.status).send(err);
        }
        else {
            res.send( { news: result_news } );
        }
    });
});

router.delete('/main/:userId/news/:newsId', function (req, res) {
    NewsModel.remove({_id: req.params.newsId}, function (err) {
        if (err) {
            res.send(err); 
        }
        else {
            res.send({});
        }
    });
});

router.get('/test/new/students/:teacherId', function (req, res) {
    UserModel.findOne({_id: req.params.teacherId}, function(err, result_user){
        if (err) {
            res.status(err.status).send(err);
        }
        else {
            if(result_user.role === 2) {
                UserModel.find({'_id': { $in: result_user.students}}, function (err, result_students) {
                    if (err) {
                        res.status(err.status).send(err);
                    }
                    else {
                        res.send(result_students);
                    }    
                });
            }
            else {
                res.status(err.status).send(err);
            }
        } 
    });
});

router.post('/test/new', function (req, res) {
    UserModel.findOne({_id: req.body.teacherId}, function(err, result_teacher){
        if (err) {
            res.status(err.status).send(err);
        }
        else {
            if(result_user.role === 2) {
                var test = {};
                
                var testDB = new TestModel(test);
                testDB.save(function(err){if(err) console.log(err)}); 
                
                //get testId there
                
                
                var question = {};
                for (var i = 0; i < req.body.questions.length; i++) {
                    question.questionText = req.body.questions[i].text;
                    question.questionCost = req.body.questions[i].cost;
                    question.questionType = req.body.questions[i].typeInd;
                    if (req.body.questions[i].typeInd === 3)
                        question.additionalPicture = req.body.questions[i].additionalPicture;
                    if (req.body.questions[i].typeInd === 0 || req.body.questions[i].typeInd === 1 || req.body.questions[i].typeInd === 1)
                        question.answers = req.body.questions[i].answers;
                    //add testId
                }
            }
            else {
                res.status(err.status).send(err);
            }
        }
    });
    
    console.log(req.body);
});

router.get('/main', function (req, res) {
   res.send('');
});

app.use('/', router);