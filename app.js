process.env.PWD = process.cwd()

var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var path = __dirname + '/views/';
var adminRouter= require('./routes/adminRouter');
var articleRouter= require('./routes/articleRouter');
var certRouter= require('./routes/certRouter');
var index = require('./routes/index');
var logger = require('morgan');
var port = Number(process.env.PORT || 3000);
// using passport
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var expressSession = require('express-session'),
    LocalStrategy = require('passport-local').Strategy;
//until here

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
const Admin = require('./models/admins');
const Article = require('./models/articles');
const Certificate = require('./models/certificates');

var dbUrl='mongodb://saarthi1:password@ds251737.mlab.com:51737/saarthi';
mongoose.connection.openUri(dbUrl);
mongoose.connection.on('connected',function(){
  console.log('mongoose connected to '+dbUrl);
});

// use passport
app.use(expressSession({secret: 'mySecretKey',resave:false,saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
// until here

app.use('/article',articleRouter);
app.use('/admin',adminRouter);
app.use('/cert',certRouter);
app.use('/', index );

app.use(express.static(process.env.PWD + '/views'));
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/*', function(req, res, next) {
  res.sendFile(__dirname+req.url);
});

app.get('/',function(req,res){
  console.log('inside get');
  res.send('hello ');
});
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use("/",router);

var server = app.listen(port,function(){
  console.log("Live at port "+server.address().port);
});
