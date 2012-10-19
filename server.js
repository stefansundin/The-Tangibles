var app = require('express').createServer();
app.listen(8000);
var webRTC = require('webrtc.io').listen(app);

var socketserver = require('./socketserver.js').socketserver();



app.get('/', function(req, res) {
  //console.log('Opening lobby');	
  //var path = "C://Users//Karl//Desktop//ParnesProjeect//webrtc//";
  res.sendfile(__dirname + '/client/index.html');
});

app.get('/room', function(req, res) {
//  console.log('Opening room');
  res.sendfile(__dirname + '/client/room.html');
});

app.get('/workspace', function(req,res) {
//  console.log('Opening workspace');
  res.sendfile(__dirname + '/client/workspace.html');
});

app.get('/roomstyle.css', function(req, res) {
  res.sendfile(__dirname + '/client/css/roomstyle.css');
});

app.get('/workspacestyle.css', function(req, res) {
  res.sendfile(__dirname + '/client/css/workspacestyle.css');
});

app.get('/style.css', function(req, res) {
  res.sendfile(__dirname + '/client/css/lobbystyle.css');
});

app.get('/socket.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/socket.js');
});

app.get('/lobby.js', function(req, res) {
  res.sendfile(__dirname + '/client/js/lobby.js');
});

app.get('/webrtc.io.js', function(req, res) {
	var path = __dirname + '/node_modules/webrtc.io/node_modules/webrtc.io-client/lib/webrtc.io.js';
  res.sendfile(path);
});


webRTC.rtc.on('connect', function(rtc) {
  //Client connected
});

webRTC.rtc.on('send answer', function(rtc) {
  //answer sent
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
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