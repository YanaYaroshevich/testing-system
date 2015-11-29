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
var connection = mongoose.connection;
cloudinary.config(cloudConfig);

var account = {};

var UserModel = mongoose.model('User', schemas.userSchema);
var QuestionModel = mongoose.model('Question', schemas.questionSchema);
var TestModel = mongoose.model('Test', schemas.testSchema);
var StudentTestModel = mongoose.model('StudentTest', schemas.studentTestSchema);
var NewsModel = mongoose.model('NewsModel', schemas.newsSchema);

var ObjectID = require('mongodb').ObjectID;

stormpath.loadApiKey(keyfile, function apiKeyFileLoaded(err, apiKey) {
    if (err) { throw err; }
    client = new stormpath.Client({apiKey: apiKey});
    
    client.getApplication(security.application, function (error, application) {
        if (error) { throw error; }
        appStormpath = application;
        app.listen(port);
        
        //addStudent();
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

app.use('/', express.static(rootDir + '\\app'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get(['/start', '/main', '/new/test', '/test/:testId'], function(req, res) {
    res.sendFile(rootDir + '\\app' + '\\index.html');
});

/*app.use(function(req, res, next) {
  res.status(404).sendFile(rootDir + '\\app' + '\\index.html');
});*/

app.use('/', router);

var addStudent = function() {
     UserModel.findOne({email: 'b@b.bbb'}, function(err, result_teacher){
        if (err) {
            console.log(err);
        }
        else {
            UserModel.findOne({email: 'yaroshevich.yana@gmail.com'}, function(err, result_student){
                if (err) {
                    conole.log(err);
                }
                else {
                    result_teacher.students.push(result_student._id);
                    result_teacher.save(function (err) {
                        if (err) 
                           console.log(err);
                    });
                }
            });  
        }
    });
};

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('/start');
});

router.post('/login', function (req, res) {
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

router.post('/logout', function (req, res) {
    res.send({lalka: ''});
});

router.get('/user/:userId', function(req, res) {
    UserModel.findOne({_id: req.params.userId}, function(err, result_user) {
        if (err) {
            res.send(err);
        }
        else {
            res.send( { account: result_user } );
        }
    });
});

router.get('/main/:userId/news', function (req, res) {
    NewsModel.find({userId: req.params.userId}, function (err, result_news) {
        if (err) {
            res.send(err);
        }
        else {
            res.send( { news: result_news } );
        }
    });
});

router.delete('/main/:userId/news/:newsId', function (req, res) {
    NewsModel.findOne({_id: req.params.newsId}, function (err, news) {
        if (err) {
            res.send(err); 
        }
        else {
            news.remove(function(err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send('');
                }
            });
        }
    });
});

router.get('/test/page/:testId', function(req, res) {
    TestModel.findOne({_id: req.params.testId}, function (err, result_test) {
        if (err) {
            res.send(err);
        }
        else {
            var toSend = {
                name: result_test.name,
                description: result_test.description,
                finish: result_test.finish,
                start: result_test.start
            };
            StudentTestModel.find({testId: result_test._id}, function (err, result_usersTest) {
                if (err) {
                    res.send(err);
                }
                else {
                    var usersTest = result_usersTest.map(function(cur){
                        return {
                            passed: cur.passed,
                            assigned: cur.assigned,
                            id: cur.studentId
                        };
                    });
                    UserModel.findOne({_id: result_test.teacherId}, function(err, result_teacher){
                        if (err) {
                            res.send(err);
                        }
                        else {
                            toSend.teacher = result_teacher;
                            UserModel.find({role: 1, '_id': { $in: result_teacher.students}}, function(err, all_students){
                                if (err) {
                                    res.send(err);
                                }
                                else {
                                    toSend.students = all_students.map(function(cur){
                                        var toReturn = {
                                            firstName: cur.firstName,
                                            lastName: cur.lastName,
                                            email: cur.email,
                                            course: cur.course,
                                            group: cur.group, 
                                            passed: false,
                                            assigned: false
                                        };
                                        for (var i = 0; i < usersTest.length; i++){
                                            if (cur._id.toString() === usersTest[i].id.toString()){
                                                toReturn.passed = usersTest[i].passed;
                                                toReturn.assigned = usersTest[i].assigned;
                                                break;
                                            }
                                        }
                                        return toReturn;
                                    });
                                    QuestionModel.find({testId: result_test._id}, function(err, result_qs){
                                         if (err) {
                                            res.send(err);
                                        }
                                        else {    
                                            toSend.questions = result_qs.map(function(cur){
                                                return {
                                                    text: cur.text,
                                                    cost: cur.cost,
                                                    type: cur.type,
                                                    answers: cur.answers  
                                                };
                                            });
                                            console.log(toSend);
                                            res.send( { test: toSend } );
                                        }
                                    });
                                }
                            })
                        }     
                    });
                }
            });
        }
    });
});

var dateCreation = function (date, isStart) {
    var d = new Date(date);
    if (isStart) {
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
    }
    else {
        d.setHours(23);
        d.setMinutes(59);
        d.setSeconds(59);
        d.setMilliseconds(999);
    }
    return d;
};

var questionsAdding = function(req, testId, res){
    var questions = [];
    var question = {};
                
    for (var i = 0; i < req.body.questions.length; i++) {
        question.text = req.body.questions[i].text;
        question.cost = req.body.questions[i].cost;
        question.type = req.body.questions[i].typeInd;
        if (req.body.questions[i].typeInd === 3)
            question.additionalPicture = req.body.questions[i].additionalPicture;
        if (req.body.questions[i].typeInd === 0 || req.body.questions[i].typeInd === 1 || req.body.questions[i].typeInd === 1){
            question.answers = req.body.questions[i].answers.map( function(ans) {
                return {
                    text: ans.text,
                    right: ans.right
                };
            });
        }
        question.testId = testId;
        question._id = new ObjectID();
        questions.push(question);
        question = {};
    }
    
    connection.collection('questions').insert(questions);
};

var studentTestAdding = function(testId, studId, res) {
    var studentTest = {};
    studentTest.testId = testId;
    studentTest.studentId = studId;
    studentTest.passed = false;
    studentTest.assigned = true;
    
    var studentTestDB = new StudentTestModel(studentTest);
    studentTestDB.save(function(err){
        if(err) {
            res.send(err);
        }               
    });
};

var newsAdding = function(studId, text, linkText, testId, res) {
    var news = {};
    news.userId = studId;
    news.text = text;
    news.link = '/test/' + testId;
    news.linkText = linkText;
    
    var newsDB = new NewsModel(news);
    newsDB.save(function(err){
        if(err) {
            res.send(err);
        }               
    });
};

router.post('/new/test/add', function (req, res) {
    UserModel.findOne({_id: req.body.teacherId}, function(err, result_teacher){
        if (err) {
            res.send(err);
        }
        else {
            if(result_teacher.role === 2) {
                var test = {};
                test.name = req.body.name;
                test.description = req.body.description;
                test.start = dateCreation(req.body.from, true);  
                test.finish = dateCreation(req.body.to, false);
                test.teacherId = req.body.teacherId;
                test.active = true;
                var testId;

                var testDB = new TestModel(test);
                testDB.save(function(err, curTest) {
                    if(err) {
                        res.send(err);
                    }
                    else {
                        testId = curTest._id;
                        questionsAdding(req, testId, res);
                        for (var i = 0; i < req.body.students.length; i++) {
                            studentTestAdding(testId, req.body.students[i], res);
                            newsAdding(req.body.students[i], 'New test was created', 'Click here to open', testId, res);
                        }
                        newsAdding(req.body.teacherId, 'Your test was successfully created', 'Click here to open', testId, res);
                        res.send({testId: testId});
                    }   
                });
            }
            else {
                res.send(err);
            }
        }
    });
});

router.get('/new/test/students/:teacherId', function (req, res) {
    UserModel.findOne({_id: req.params.teacherId}, function(err, result_user){
        if (err) {
            res.send(err);
        }
        else {
            if(result_user.role === 2) {
                UserModel.find({'_id': { $in: result_user.students}}, function (err, result_students) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.send(result_students);
                    }    
                });
            }
            else {
                res.send(err);
            }
        } 
    });
});