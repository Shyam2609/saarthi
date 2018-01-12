process.env.PWD = process.cwd()
var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
var path = require("path");
const Article = require(__dirname+'/../models/articles');
/* GET users listing. */
const articleRouter = express.Router();

articleRouter.use(bodyParser.json());
articleRouter.use(express.static(process.env.PWD + '/views'));
//articleRouter.use(express.bodyParser());
articleRouter.use(bodyParser.json() );       // to support JSON-encoded bodies
articleRouter.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// to retrive the given article from db
articleRouter.get('/:id', function(req, res, next) {

    console.log(req.params.id);
    var str1 = req.params.id;
   Article.find({"_id":str1}, function(err, data) {
    if(err) {
     res.send(err.message);
   }
   else{
    res.render('viewArt',{data:data});
      //console.log(data);
    }
  });
});

// to get the image path and send it fir the display
articleRouter.get('/*', function(req, res, next) {

   res.sendFile(path.join(__dirname, '/../', req.url));
});


module.exports = articleRouter;
