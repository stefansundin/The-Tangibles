var app = require('express').createServer();
app.listen(80);
var webRTC = require('webrtc.io').listen(app);

var socketserver = require('./socketserver.js').socketserver();



app.get('/', function(req, res) {
  //console.log('Opening lobby');	
  //var path = "C://Users//Karl//Desktop//ParnesProjeect//webrtc//";
  res.sendfile(__dirname + '/client/index.html');
});

app.get('/favicon.ico', function(req, res) {
  res.sendfile(__dirname + '/client/img/favicon.ico');
});

app.get('/room', function(req, res) {
//  console.log('Opening room');
  res.sendfile(__dirname + '/client/room.html');
});

app.get('/workspace', function(req,res) {
//  console.log('Opening workspace');
  res.sendfile(__dirname + '/client/workspace.html');
});

app.get('/room/css/roomstyle.css', function(req, res) {
  res.sendfile(__dirname + '/client/css/roomstyle.css');
});

app.get('/workspace/css/workspacestyle.css', function(req, res) {
  res.sendfile(__dirname + '/client/css/workspacestyle.css');
});

app.get('/css/lobbystyle.css', function(req, res) {
  res.sendfile(__dirname + '/client/css/lobbystyle.css');
});

app.get('/js/socket.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/socket.js');
});

app.get('/js/lobby.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/lobby.js');
});

app.get('/js/tangibles.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/tangibles.js');
});

app.get('/img/accept.png', function(req, res) {
  res.sendfile(__dirname + '/client/img/accept.png');
});

app.get('/img/deny.png', function(req, res) {
  res.sendfile(__dirname + '/client/img/deny.png');
});

app.get('/img/mute.png', function(req, res) {
    res.sendfile(__dirname + '/client/img/mute.png');
});

app.get('/js/tangibleLib.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/tangibleLib.js');
});

app.get('/js/mediaext.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/mediaext.js');
});

app.get('/js/geometry.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/geometry.js');
});

app.get('/js/cv.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/cv.js');
});

app.get('/js/aruco.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/aruco.js');
});

app.get('/js/imageproc.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/imageproc.js');
});

app.get('/js/buttons.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/buttons.js');
});

app.get('/js/calibration.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/calibration.js');
});

app.get('/js/lib/sylvester.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/lib/sylvester.js');
});

app.get('/webrtc.io.js', function(req, res) {
	var path = __dirname + '/node_modules/webrtc.io/node_modules/webrtc.io-client/lib/webrtc.io.js';
  res.sendfile(path);
});


webRTC.rtc.on('connect', function(rtc) {
  //Client connected
  console.log("WEBRTC: connect");
});

webRTC.rtc.on('send answer', function(rtc) {
  //answer sent
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
  console.log("WEBRTC: disconnect");
});

webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});

//var S = new socketserver();
