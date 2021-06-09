var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/welcome.html');
});
app.get('/index.html', function(req, res,next) {  
  res.sendFile(__dirname + '/index.html');
});
app.get('/script.js', function(req, res,next) {
    res.sendFile(__dirname + '/script.js');
})

var users = {}
var userList = []

io.on('connection', socket => {
    socket.on('new-user', n => {
      var user = {
        name: n,
        id: socket.id
      }
      users[socket.id] = n
      userList.push(n)
      socket.broadcast.emit('user-connected', n)
    })
    socket.on('send-chat-message', message => {
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
    })
  })

server.listen(80);