var bodyParser=require('body-parser');
var mongoose=require('mongoose');

const cheerio=require('cheerio');
const request=require('request');
var session=require('express-session');
const emailRegex=require('email-regex');
var userSchema = require('./UserSchema');
var data=[{item:'hi'},{item:'hello'}];

mongoose.connect('mongodb+srv://anjana:procastinator123@anjana-iaw9q.mongodb.net/test?retryWrites=true&w=majority',{  useUnifiedTopology: true ,useNewUrlParser: true });
const User = mongoose.model('User',userSchema)
var urlencodedParser=bodyParser.urlencoded({extend:false});
module.exports = (function(app){

  app.get('/bot', function(req,res){
    res.render('bot');
  })

  app.get('/chat', function(req,res){
    res.render('chat');
  })
  app.use(session({secret:"dbox"}));
app.post('/chat',urlencodedParser, function(req,res){
var text=req.body.name;
var flag=0;
console.log(req.body);
if(emailRegex().test(text))
{

console.log(req.body);
User.find({email_id:text},(err,docs)=>{
  console.log(docs);
  if(docs.length==0)
  {
      req.session.email=text;
    res.send({status:'Please  Register,Enter you name',keyword:'rname'});
  }
  else {
  var pass=docs[0].password;
  req.session.password=pass;
  console.log(pass);
  flag=1;
res.send({status:'Please Enter Password',keyword:'password'});
}
});

}
else if(req.body.keyword=='rname')
{
  req.session.rname=text;
  res.send({status:'Enter you Password',keyword:'rpassword'});
}

else if(req.body.keyword=='password'){
 var emailId=req.session.email;
 if(text==req.session.password)
 {
   console.log('Hi I entered');
   res.send({status:'Hello,What do you want to know',keyword:'resume'});
 }
 else {
     res.send({status:'Please Enter Valid Password',keyword:'invalid'});
 }
}
else if(req.body.keyword=='success' || req.body.keyword=='resume')
{
  console.log('Hey');
  var word=req.body.name;
  var pageToVisit = "https://darwinbox.com/index.php";
  console.log("Visiting page " + pageToVisit);
  request(pageToVisit, function(error, response, body) {
     if(error) {
       console.log("Error: " + error);
     }
     // Check status code (200 is HTTP OK)
     console.log("Status code: " + response.statusCode);
     if(response.statusCode === 200) {
       // Parse the document body
       var $ = cheerio.load(body);
       var links=collectInternalLinks($);

       for(var i=0;i<links.length;i++)
       {
         if(links[i].includes(word))
         {
           console.log(links[i]);
           fun(links[i]);
           break;
         }
       }
     }
  });

  function collectInternalLinks($) {
    var allRelativeLinks = [];
    var allAbsoluteLinks = [];

    var relativeLinks = $("a[href^='/']");
    relativeLinks.each(function() {
        allRelativeLinks.push($(this).attr('href'));

    });

    var absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function() {
        allAbsoluteLinks.push($(this).attr('href'));
    });
    var allLinks = allAbsoluteLinks.concat(allRelativeLinks);
    return allLinks;
  }

  function fun(link)
  {
    var page = "https://darwinbox.com/"+link;

    console.log("Visiting page " + page);
    request(page, function(error, response, body) {
       if(error) {
         console.log("Error: " + error);
       }
       // Check status code (200 is HTTP OK)
       console.log("Status code: " + response.statusCode);
       if(response.statusCode === 200) {
         // Parse the document body
         var $ = cheerio.load(body);
         link="https://darwinbox.com/"+link;
           var reply=$("meta[name='description']").attr("content");
           // reply=reply+"<a href='" + link + "'> Read More</a>";
           res.send({status:reply,keyword:'resume',link:link});
       }
    });

  }
}
else if(req.body.keyword=='rpassword')
{
    req.session.rpassword=text;
    var newuser=new User();
    newuser.name=req.session.rname;
    newuser.password=req.session.rpassword;
    newuser.email_id=req.session.email;
    newuser.save((err,doc)=>{
                if(err){
                    console.log(err);
                }
                else
                {
                    console.log('Inserted');
                }
            })
  res.send({status:'Registration Successful,What do you want to know',keyword:'success'});
}
/*else if(keyword=='success' || keyword=='resume')
{
  var word=req.body.name;
  var pageToVisit = "https://darwinbox.com/index.php";
  console.log("Visiting page " + pageToVisit);
  request(pageToVisit, function(error, response, body) {
     if(error) {
       console.log("Error: " + error);
     }
     // Check status code (200 is HTTP OK)
     console.log("Status code: " + response.statusCode);
     if(response.statusCode === 200) {
       // Parse the document body
       var $ = cheerio.load(body);
       var links=collectInternalLinks($);

       for(var i=0;i<links.length;i++)
       {
         if(links[i].includes(word))
         {
           console.log(links[i]);
           fun(links[i]);
           break;
         }
       }
     }
  });

  function collectInternalLinks($) {
    var allRelativeLinks = [];
    var allAbsoluteLinks = [];

    var relativeLinks = $("a[href^='/']");
    relativeLinks.each(function() {
        allRelativeLinks.push($(this).attr('href'));

    });

    var absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function() {
        allAbsoluteLinks.push($(this).attr('href'));
    });
    var allLinks = allAbsoluteLinks.concat(allRelativeLinks);
    return allLinks;
  }

  function fun(link)
  {
    var page = "https://darwinbox.com/"+link;

    console.log("Visiting page " + page);
    request(page, function(error, response, body) {
       if(error) {
         console.log("Error: " + error);
       }
       // Check status code (200 is HTTP OK)
       console.log("Status code: " + response.statusCode);
       if(response.statusCode === 200) {
         // Parse the document body
         var $ = cheerio.load(body);
           var reply=$("meta[name='description']").attr("content")+"For more details please visit"+link;
           res.send({status:reply,keyword:'resume'});
       }
    });

  }
}*/

});
});
