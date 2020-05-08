// server.js
require('dotenv').load();
var fs = require('fs');
var rimraf = require("rimraf");
// init project
var express = require('express');
var app = express();
var debug = process.env.DEBUG == "true";

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('app'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  if(debug) {
    response.sendFile(__dirname + '/app/360-image.html');
  } else {
    response.sendFile(__dirname + '/app/index.html');
  }
});

app.get("/360", function(request, response) {
  response.sendFile(__dirname + '/app/360-image.html');
});

app.post("/store", function (req, res) {
  var dirname = __dirname + "/.data/"
  if (!fs.existsSync(dirname)){
    fs.mkdirSync(dirname);
  }
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
  var fileName = __dirname + "/.data/" + fileId + ".json";
  res.sendFile(fileName);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
