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
        /*addUser(0, 'a@a.aaa', 'Aaa', 'Aaa', '-1', -1);
        addUser(2, 'b@b.bbb', 'Bbb', 'Bbb', '-1', -1);
        addUser(1, 'yaroshevich.yana@gmail.com', 'Yana', 'Yaroshevich', '8', 3);
        addUser(1, 'c@c.ccc', 'Ccc', 'Ccc', '2', 1);
        addStudent('b@b.bbb', 'c@c.ccc');
        addStudent('b@b.bbb', 'yaroshevich.yana@gmail.com');*/
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.all('*', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Methods": "PUT, DELETE, POST, GET, OPTIONS"
    });
    next();
});

var router = express.Router();

var rootDir = __dirname.substring(0, __dirname.lastIndexOf('\\'));

app.use(express.static(rootDir + '\\app'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(router);

var addUser = function(role, email, fn, ln, group, course){
    var user = {
        role: role,
        email: email,
        firstName: fn,
        lastName: ln,
        picture: '',
        tests: [],
        students: [],
        group: group,
        course: course
    };
        
    var aaa = new UserModel(user);
    aaa.save(function(err){if(err) console.log(err)}); 
};

var addStudent = function(teacher_email, stud_email) {
     UserModel.findOne({email: teacher_email}, function(err, result_teacher){
        if (err) {
            console.log(err);
        }
        else {
            UserModel.findOne({email: stud_email}, function(err, result_student){
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

router.post('/rest/login', function (req, res) {
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
                    result_acc.online = true;
                    result_acc.save(function(err){console.log(err)});
                    res.send({account: result_acc, noErrors: true});
                }
            });
        }
    });
});

router.post('/rest/logout', function (req, res) {
    UserModel.findOne({_id: req.body.id}, function(err, result_acc){
        if(err) {
            res.send(err);
        }
        else {
            result_acc.online = false;
            result_acc.save(function(err){console.log(err)});
            res.send({account: result_acc});
        }
    });
    
});

router.get('/rest/user/:userId', function(req, res) {
    UserModel.findOne({_id: req.params.userId}, function(err, result_user) {
        if (err) {
            res.send(err);
        }
        else {
            res.send( { account: result_user } );
        }
    });
});

router.get('/rest/main/:userId/news', function (req, res) {
    NewsModel.find({userId: req.params.userId}, function (err, result_news) {
        if (err) {
            res.send(err);
        }
        else {
            res.send( { news: result_news } );
        }
    });
});

router.delete('/rest/main/:userId/news/:newsId', function (req, res) {
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

router.get('/rest/test/:testId', function(req, res) {
    TestModel.findOne({_id: req.params.testId}, function (err, result_test) {
        if (err) {
            res.send(err);
        }
        else {
            var toSend = {
                name: result_test.name,
                description: result_test.description,
                finish: result_test.finish,
                start: result_test.start,
                id: req.params.testId
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
                            id: cur.studentId,
                            dateOfPass: cur.dateOfPass,
                            grade: cur.grade
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
                                            assigned: false,
                                            dateOfPass: null,
                                            grade: 0,
                                            id: cur._id
                                        };
                                        for (var i = 0; i < usersTest.length; i++){
                                            if (cur._id.toString() === usersTest[i].id.toString()){
                                                toReturn.passed = usersTest[i].passed;
                                                toReturn.assigned = usersTest[i].assigned;
                                                toReturn.dateOfPass = usersTest[i].dateOfPass;
                                                toReturn.grade = usersTest[i].grade;
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
                                                    typeInd: cur.typeInd,
                                                    answers: cur.answers,
                                                    id: cur._id
                                                };
                                            });
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

router.get('/rest/test/:testId/stud/:studId', function(req, res) {
    TestModel.findOne({_id: req.params.testId}, function (err, result_test) {
        if (err) {
            res.send(err);
        }
        else {
            var toSend = {
                name: result_test.name,
                id: req.params.testId,
                passed: null,
                assigned: null,
                grade: 0
            };
            StudentTestModel.find({testId: result_test._id}, function (err, result_usersTest) {
                if (err) {
                    res.send(err);
                }
                else {
                    for(var i = 0; i < result_usersTest.length; i++){
                        if(result_usersTest[i].studentId == req.params.studId){
                            toSend.passed = result_usersTest[i].passed;
                            toSend.assigned = result_usersTest[i].assigned;
                            toSend.grade = result_usersTest[i].grade;
                        }
                    }
                    QuestionModel.find({testId: result_test._id}, function(err, result_qs){
                        if (err) {
                            res.send(err);
                        }
                        else {
                            toSend.questions = result_qs.map(function(cur){
                                if (cur.typeInd === 0 || cur.typeInd === 3){
                                    var rightAnsQ = 0;
                                    for (var i = 0; i < cur.answers.length; i++){
                                        if (cur.answers[i].right)
                                            rightAnsQ++;
                                    }
                                    return {
                                        text: cur.text,
                                        typeInd: cur.typeInd,
                                        answers: cur.answers.map(function(ans){
                                            return {
                                                text: ans.text,
                                                num: cur.answers.indexOf(ans)
                                            };
                                        }),
                                        id: cur._id,
                                        multipleRight: (rightAnsQ > 1)
                                    };
                                }
                                else if (cur.typeInd === 2) {
                                    var firstPart = cur.text.substring(0, cur.text.indexOf('###'));
                                    var secondPart =  cur.text.substring(cur.text.lastIndexOf('###') + 3, cur.text.length);
                                    return {
                                        firstPart: firstPart,
                                        secondPart: secondPart,
                                        typeInd: cur.typeInd,
                                        id: cur._id
                                    };
                                }
                                
                            });
                            res.send( { test: toSend } );
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
        question.typeInd = req.body.questions[i].typeInd;
        if (req.body.questions[i].typeInd === 3)
            question.additionalPicture = req.body.questions[i].additionalPicture;
        if (req.body.questions[i].typeInd === 0 || req.body.questions[i].typeInd === 1 || req.body.questions[i].typeInd === 3){
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

router.post('/rest/test/new', function (req, res) {
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

router.post('/rest/test/pass', function(req, res){
    var questionIds = req.body.questions.map(function(cur){
        return cur.id;
    });
    QuestionModel.find({'_id': { $in: questionIds }}, function(err, result_questions){
        console.log(result_questions);
        if (err) {
            res.send(err);
        }
        else {
            var totalCost = 0;
            var studCost = 0;
            for (var i = 0; i < result_questions.length; i++){
                totalCost += result_questions[i].cost;
                
                if (result_questions[i].typeInd === 0 || result_questions[i].typeInd === 3) {
                    var right = true;
                    for (var j = 0; j < result_questions[i].answers.length; j++){
                        if (result_questions[i].answers[j].right && req.body.questions[i].answers.indexOf(j) === -1){
                            right = false;
                        }
                        if (!result_questions[i].answers[j].right && req.body.questions[i].answers.indexOf(j) !== -1){
                            right = false;
                        }
                    }
                    
                    studCost += (right) ? result_questions[i].cost : 0;
                }
                else if (result_questions[i].typeInd === 2) {  
                    if (req.body.questions[i].answers[0] === result_questions[i].text.substring(result_questions[i].text.indexOf('###') + 3, result_questions[i].text.lastIndexOf('###'))){
                        studCost += result_questions[i].cost;
                    }       
                }
            }
            StudentTestModel.findOne({studentId: req.body.studId, testId: req.body.testId}, function(err, result_studTest){
                if (err){
                    res.send(err);
                }    
                else {
                    result_studTest.passed = true;
                    result_studTest.grade = (studCost * 100 / totalCost);
                    result_studTest.dateOfPass = new Date();
                    result_studTest.save(function(err){
                        if (err) {
                            res.send(err);
                        }
                    }); 
                    res.send({});
                }
            });
        }
    });
});

router.put('/rest/test/:testId/edit', function(req, res) {
    TestModel.findOne({_id: req.params.testId}, function(err, result_test){
        if (err){
            res.send(err);
        }
        else {
            result_test.name = req.body.name;
            result_test.description = req.body.description;
            result_test.start = dateCreation(req.body.from, true);  
            result_test.finish = dateCreation(req.body.to, false);
            result_test.active = true;
            result_test.save(function(err){
                if (err) {
                    res.send(err);
                }
            }); 
            
            QuestionModel.find({testId: req.params.testId}, function(err, result_questions){
                if (err){
                    res.send(err);
                }
                else {
                    for (var i = 0; i < result_questions.length; i++) {
                        result_questions[i].remove(function(err){
                            if (err) {
                                res.send(err);
                            }
                        });
                    }
                    questionsAdding(req, result_test._id, res);
                }
            });
            StudentTestModel.find({testId: req.params.testId}, function(err, result_studentTests){
                if (err){
                    res.send(err);
                }
                else {
                    for (var i = 0; i < result_studentTests.length; i++) {
                        result_studentTests[i].remove(function(err){
                            if (err) {
                                res.send(err);    
                            }
                        });
                    }   

                    for (var i = 0; i < req.body.students.length; i++) {
                        studentTestAdding(req.params.testId, req.body.students[i], res);
                        newsAdding(req.body.students[i], 'The test was edited', 'Click here to open', result_test._id, res);
                    }
                    newsAdding(req.body.teacherId, 'Your test was successfully edited', 'Click here to open', result_test._id, res);
                    res.send({});
                }
            });
            
        }
    });
    
});

router.get('/rest/test/new/students/:teacherId', function (req, res) {
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

router.get('/rest/tests/:userId', function(req, res) {
    UserModel.findOne({_id: req.params.userId}, function(err, result_user) {
        if (err){
            res.send(err);
        }
        else {
            if (result_user.role === 1) {
                StudentTestModel.find({studentId: result_user._id}, function(err, result_studentTests) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        var testsIds = result_studentTests.map(function(cur){
                            return cur.testId;
                        });
                        TestModel.find({'_id': { $in: testsIds }}, function(err, result_tests) {
                            if (err) {
                                res.send(err);
                            }    
                            else {
                                var testsToSend = [];
                                for (var i = 0; i < result_tests.length; i++) {
                                    if (new Date(result_tests[i].start) <= new Date() && new Date(result_tests[i].finish) >= new Date()) {
                                        testsToSend.push(result_tests[i]);
                                    }
                                }
                                res.send({tests: testsToSend});
                            }
                        });
                    }
                });
            }
            else if (result_user.role === 2) {
                TestModel.find({teacherId: result_user._id}, function(err, result_tests){
                    if (err) {
                        res.send(err);
                    }
                    else {
                       res.send({tests: result_tests});
                    }
                });
                
            }
            else {
                res.send({tests: ''});
            }
        }
    });
});

app.get('*', function(req, res, next) {
  res.sendFile(rootDir + '\\app' + '\\index.html');
});