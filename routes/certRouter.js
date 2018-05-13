process.env.PWD = process.cwd()
var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
var path = require("path");
const Article = require(__dirname+'/../models/articles');
const Cert = require(__dirname+'/../models/certificates');


//passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//require('./home/shyam/Proj/example/node_modules/passport')(passport);


var multer = require('multer')
, MongoClient = require('mongodb').MongoClient
, ObjectId = require('mongodb').ObjectId
, fs = require('fs')
, util = require('util')
, storage = multer.diskStorage({
  destination : function(req,file,cb){
    cb(null,'uploads/')
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+file.originalname);
  }
});
var upload = multer({storage:storage});
/* GET users listing. */
const certRouter = express.Router();
//certRouter.use(bodyParser.json());

//view file with css
certRouter.use(bodyParser.json());
certRouter.use(express.static(process.env.PWD + '/views'));
//articleRouter.use(express.bodyParser());
certRouter.use(bodyParser.json() );       // to support JSON-encoded bodies
certRouter.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//render teh main certificate page
certRouter.get('/',function(req, res) {
  console.log('inside get certRouter');
  res.render('cert');
  //res.render('login');
  //res.sendFile(path.join(__dirname, '/../views', 'user.html'));
});

//to query certificate in db using phone number
certRouter.post('/cert', upload.any(), function (req, res){
  //console.log("inside add addCertificate method");

  // define your new document
  //console.log(req.files[0].path);
  //console.log(req.body.title);
  //var imgPath = req.files[0].path;
  console.log(req.body.emailId);
  var str1 = req.body.emailId;
  Cert.find({"emailId":str1}, function(err, data) {
    if(err) {
     res.send(err.message);
   }
   else{
    //console.log(data[0].name);
    //console.log(data[0].phone);
    
    res.render('viewCert',{data:data});
      //console.log(data);
    }
  });
});

module.exports = certRouter;

