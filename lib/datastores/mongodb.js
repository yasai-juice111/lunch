var mongoose = require('mongoose');
var url = mongodbConf.host;

var db  = mongoose.createConnection(url, function(err, res){
    if(err){
        console.log('Error connected: ' + url + ' - ' + err);
    }else{
        console.log('Success connected: ' + url);
    }
});

// Modelの定義
var UserSchema = new mongoose.Schema({
  sid : String,
  id : Number,
  employeeId : String
},{collection: 'info'});

exports.User = db.model('User', UserSchema);