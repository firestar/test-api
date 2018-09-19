var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request');
var uuidv1 = require('uuid/v1');

var memoryData = {
  tempKeys: {},
  fileData: {
    "21312d1fwfsf12": "cookie.mov",
    "sdff234fsf23ff": "popcorn.mp4",
    "fask893ffksdf0": "yogurt.jpg"
  }
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/create/:session/:file', function (req, res) {
  if(!memoryData.fileData.hasOwnProperty(req.params['file'])){
    res.send({"error": "file not found."});
    return;
  }
  var random = uuidv1();
  memoryData.tempKeys[random] = {
    "session": req.params['session'],
    "file": memoryData.fileData[req.params['file']]
  };
  res.send({ "key": random, "session":  req.params['session']});
});

app.get('/relay/get_file', function(req, res){
  var start = new Date().getTime();
  request('http://localhost:3000/create/231231231231/21312d1fwfsf12', function (error, response, body) {
    var total = new Date().getTime() - start;
    var responseObject = JSON.parse(body);
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    res.send({"key": responseObject.key, "total": total + "ms" });
  });
});
app.get('/get/:key', function (req, res) {
  if(memoryData.tempKeys.hasOwnProperty(req.params['key'])){
    res.send({"error": "temp key not found."});
    return;
  }
  res.send(memoryData.tempKeys[req.params['key']]);
  delete memoryData.tempKeys[req.params['key']];
});

module.exports = app;
