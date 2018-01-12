process.env.PWD = process.cwd()
var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
var path = require("path");

//require the models
const Article = require(__dirname+'/../models/articles');
const Admin = require(__dirname+'/../models/admins');
const Cert = require(__dirname+'/../models/certificates');


//passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//require('./home/shyam/Proj/example/node_modules/passport')(passport);

// passport strategy initialization
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// multer to upload the files
var multer = require('multer')
, MongoClient = require('mongodb').MongoClient
, ObjectId = require('mongodb').ObjectId
, fs = require('fs-extra')
, util = require('util')
, storage = multer.diskStorage({
  destination : function(req,file,cb){
    cb(null,'uploads/')
  },
  filename:function(req,file,cb){
    //to save the path of the file
    cb(null,Date.now()+file.originalname);
  }
});
var upload = multer({storage:storage});
/* GET users listing. */
const adminRouter = express.Router();
//adminRouter.use(bodyParser.json());

//view file with css
adminRouter.use(bodyParser.json());
adminRouter.use(express.static(process.env.PWD + '/views'));
//articleRouter.use(express.bodyParser());
adminRouter.use(bodyParser.json() );       // to support JSON-encoded bodies
adminRouter.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//render the admin page
adminRouter.get('/',function(req, res) {
 // console.log('inside get adminRouter');//to check on the console
  res.render('admin', { user : req.user });
  
});



//login route to validae and return authenticated user
adminRouter.post('/login',passport.authenticate('local', { failureRedirect: '/admin', failureFlash: true }) , function (req, res){
  //console.log('insisde add admin');
  //console.log(req.body.username);
  req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/admin');
    });
   
});

// to end teh session using logut route
adminRouter.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/admin');
    });
});

//save the admin schema with encrypted password storage
adminRouter.post('/addAdmin', upload.any(), function (req, res){
  //console.log('insisde add admin');
  //console.log(req.body.username);
    Admin.register(new Admin({ username : req.body.username }), req.body.password, (err, admin) => {
        if (err) {
          return res.render('admin', { error : err.message });
        }
        else{
          //redirects to success page
          res.render('message',{msg: 'Admin added to the database'});
        }
    });
});

// to add certificate to teh database
adminRouter.post('/addCert', upload.any(), function (req, res){
  //console.log("inside add addCertificate method");  
 // console.log(req.body.name);
  var newCert = new Cert({
   name: req.body.name,
   phone:req.body.phone,
   dob:req.body.dob,
 });
  
  newCert.save(function(err, Cert){
    if (!err) {
      //console.log('Now new Admin is saved in the database'+ req.body.name);
      res.render('message',{msg: 'Certificate added to the database'});
    }
    else {
      console.log('errorr occures'+err);
    }
  });
  
});

// add teh article with the image uploaded to folder and address stred in database
adminRouter.post('/addArticle', upload.any(), function (req, res){
  console.log("inside article method");

  // define your new document
  //console.log(req.files[0].path);
  //console.log(req.body.title);
  var imgPath = req.files[0].path;
  //console.log(imgPath);
  var newArticle = new Article({
   title: req.body.title,
   content:req.body.content,
   desc:req.body.desc,
   img:imgPath
 });
  
  newArticle.save(function(err, article){
    if (!err) {
     // console.log('Now new article is saved in the database'+ req.body.title);
      res.render('message',{msg: 'Article added to the database'});
    }
  });
  
})

module.exports = adminRouter;