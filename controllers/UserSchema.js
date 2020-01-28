var mongoose = require('mongoose');
var UserSchema =new mongoose.Schema({
    name :{
        type : String
    },
    email_id :{
        type : String
    },
    password :{
        type : String
    }
});
module.exports = UserSchema;
