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

app.use(express.json());
app.post("/store", function (req, res) {
  var json = req.body;
  var fileName = Math.random().toString(32);
  fs.writeFile(".data/" + fileName + ".json", JSON.stringify(json));
  res.send(fileName);
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
