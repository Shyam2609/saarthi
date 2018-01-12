const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// to store articles
var articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type:String,
        required:true
    },
    img:{
        type: String,
        required: true
      
    },
    content:{
      type:String,
      required:true
    }
});

var Articles = mongoose.model('Articles',articleSchema);

module.exports = Articles;
