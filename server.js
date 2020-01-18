// server.js
var fs = require('fs');
// init project
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('app'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + '/app/index.html');
});

app.post("/store", function (req, res) {
  var fileId = Math.random().toString(32)
  var fileName = __dirname + "/.data/" + fileId + ".json";
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

app.get("/draft/:draftId", function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
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
