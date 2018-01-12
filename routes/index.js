var express = require('express');
var router = express.Router();
const Article = require(__dirname+'/../models/articles');
var path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {

  res.redirect('/0');  
});

// to display main page with the page number
router.get('/:id', function(req, res, next) {

  var num = parseInt(req.params.id);

  Article.find({}, function(err, data) {
      if(err) {
       res.send('cant show the desired page');
     }
     else{
      
      res.render('index1',{data:data,page:num});
      
    }
  }).sort({$natural:-1});
});

module.exports = router;
