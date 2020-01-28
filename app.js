var express=require('express');
var chatController=require('./controllers/ChatController');
var app=express();
//var userSchema = require('./UserSchema');
app.set('view engine','ejs');
app.use(express.static('./public'));
app.listen(3000);
console.log('anjana');
chatController(app);
