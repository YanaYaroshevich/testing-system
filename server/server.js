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
        
       /* UserModel.findOne({email: 'a@a.aaa'}, function(err, result) {
           if (err)
               console.log(err);
            else {
                var news = {
                    text: "The koala (Phascolarctos cinereus, or, inaccurately, koala bear[a]) is an arboreal herbivorous marsupial native to Australia. It is the only extant representative of the family Phascolarctidae, and its closest living relatives are the wombats.[3] The koala is found in coastal areas of the mainland's eastern and southern regions, inhabiting Queensland, New South Wales, Victoria, and South Australia. It is easily recognisable by its stout, tailless body and large head with round, fluffy ears and large, spoon-shaped nose. The koala has a body length of 60–85 cm (24–33 in) and weighs 4–15 kg (9–33 lb). Pelage colour ranges from silver grey to chocolate brown. Koalas from the northern populations are typically smaller and lighter in colour than their counterparts further south. These populations possibly are separate subspecies, but this is disputed.",
                    link: '/start',
                    linkText: 'super link',
                    userId: result._id
                };
                
                var aaa = new NewsModel(news);
                aaa.save(function(err){if(err) console.log(err)});
            }
        });*/
        
        /*account = {
            username: 'admin',
            password: 'Qwertyuiop1',
            email: 'admin@admin.com',
            givenName: 'Admin',
            surname: 'Adminov',
            
            
        };*/
        
        /* var user = {
            role: 2,
            email: 'b@b.bbb',
            firstName: 'Bbbb',
            lastName: 'Bbbb',
            picture: '',
            tests: [],
            students: [],
            teachers: [],
        };
        
        var aaa = new UserModel(user);
        aaa.save(function(err){if(err) console.log(err)}); 
        
        UserModel.findOne({email: 'b@b.bbb'}, function(err, result) {
           if (err)
               console.log(err);
            else {
                var news = {
                    text: "Google was founded by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University. Together they own about 14 percent of its shares but control 56 percent of the stockholder voting power through supervoting stock. They incorporated Google as a privately held company on September 4, 1998. An initial public offering followed on August 19, 2004. Its mission statement from the outset was 'to organize the world's information and make it universally accessible and useful,' and its unofficial slogan was 'Don't be evil'. In 2004, Google moved to its new headquarters in Mountain View, California, nicknamed the Googleplex. In August 2015, Google announced plans to reorganize its interests as a holding company called Alphabet Inc. When this restructuring took place on October 2, 2015, Google became Alphabet's leading subsidiary, as well as the parent for Google's Internet interests.",
                    link: '/main',
                    linkText: 'super link',
                    userId: result._id
                };
                
                var aaa = new NewsModel(news);
                aaa.save(function(err){if(err) console.log(err)});
            }
        });*/
        
        
        
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
    console.log(req);
    NewsModel.find({userId: req.params.userId}, function (err, result_news) {
        if (err) {
            res.status(err.status).send(err);
        }
        else {
            console.log(result_news);
            res.send( { news: result_news } );
        }
    });
});

router.delete('/main/:userId/news/:newsId', function (req, res) {
    NewsModel.remove({_id: req.params.newsId}, function (err) {
        if (err)
            res.send(err); 
        else
            res.send({});
    });
});

router.get('/main', function (req, res) {
   res.send('');
});

app.use('/', router);