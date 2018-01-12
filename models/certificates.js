const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var certificateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob:{
      type:String,
      required:true
    },
    phone:{
      type:String,
      required:true
    }
});


var Certificates = mongoose.model('Certificate',certificateSchema);

module.exports = Certificates;
