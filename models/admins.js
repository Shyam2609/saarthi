var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// created schema for admin login 
var Admin = new Schema({
    username: String,
    password: String,
    
});

Admin.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', Admin);
