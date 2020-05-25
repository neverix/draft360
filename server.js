var fs = require('fs');
var rimraf = require("rimraf");
// init project
var morgan = require('morgan');
var express = require('express');
var path = require('path')
require('dotenv').config();

var debug = !!process.env.DEBUG;
var app = express();

function skipLog (req, res) {
  var url = req.url;
  if(url.indexOf('?')>0)
    url = url.substr(0,url.indexOf('?'));
  if(url.match(/(js|jpg|png|ico|css|woff|woff2|eot|json)$/ig)) {
    return true;
  }
  return false;
}

  var dirname = __dirname + "/.data/"
  if (!fs.existsSync(dirname)){
    fs.mkdirSync(dirname);
  }

// https://github.com/expressjs/morgan
if(!debug) {
  var accessLogStream = fs.createWriteStream(path.join(__dirname, '.data/access.log'), { flags: 'a' })
  app.use(morgan('combined', { stream: accessLogStream, skip: skipLog }));
}
  
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('app'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  if(debug) {
    response.redirect('/360');
  } else {
    response.sendFile(__dirname + '/app/main.html');
  }
});

app.get("/360", function(request, response) {
  response.sendFile(__dirname + '/app/360-image.html');
});

app.post("/store", function (req, res) {
  var fileId = Math.random().toString(16);
  console.log(fileId);
  var fileName = dirname + fileId + ".json";
  var body = '';
  req.on('data', function(data) {
      body += data;
  });
  req.on('end', function (){
      fs.writeFile(fileName, body, function() {
          res.send(fileId);
      });
  });
})

if(debug) {
  app.get("/clean", function(req, res) {
    rimraf(".data", () => res("ok"));
  });
}

app.get("/draft/:draftId", function (req, res) {
  res.sendFile(__dirname + '/app/360-image.html');
})

app.get("/file/:draftId", function (req, res) {
  var fileId = req.params.draftId;
  if(fileId == "access.log") return res.status(403);
  var fileName = __dirname + "/.data/" + fileId;
  res.sendFile(fileName);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
