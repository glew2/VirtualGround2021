var express = require('express');
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var { default: ShortUniqueId } = require('short-unique-id');

app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/connect.html');
});
app.get('/connectScript.js', function(req, res,next) {  
    res.sendFile(__dirname + '/connectScript.js');
});
app.get('/welcomeScript.js', function(req, res,next) {  
    res.sendFile(__dirname + '/welcomeScript.js');
});
app.get('/welcome.html', function(req, res,next) {  
    res.sendFile(__dirname + '/welcome.html');
});
app.get('/hTimeScript.js', function(req, res,next) {  
    res.sendFile(__dirname + '/hTimeScript.js');
});
app.get('/sTimeScript.js', function(req, res,next) {  
    res.sendFile(__dirname + '/sTimeScript.js');
});
app.get('/hiderTimer.html', function(req, res,next) {  
    res.sendFile(__dirname + '/hiderTimer.html');
});
app.get('/seekerTimer.html', function(req, res,next) {  
    res.sendFile(__dirname + '/seekerTimer.html');
});
app.get('/hider.js', function(req, res,next) {  
    res.sendFile(__dirname + '/hider.js');
});
app.get('/seeker.js', function(req, res,next) {  
    res.sendFile(__dirname + '/seeker.js');
});
app.get('/seeker.html', function(req, res,next) {  
    res.sendFile(__dirname + '/seeker.html');
});
app.get('/hider.html', function(req, res,next) {  
    res.sendFile(__dirname + '/hider.html');
});

const clients = {};
const games = {}; //master list of games, clients, and their IDs/names
var role = null;
const uid = new ShortUniqueId();


io.on('connection', request => {
    request.on('send-chat-message', data => {
        var g = games[data.gameId];
        var clientId = data.clientId;
        var name = "";
        var role = "";
        for (i=0; i<g.clients.length; i++) {
            if (g.clients[i].clientId===clientId) {
                name = g.clients[i].name;
                role = g.clients[i].role;
                break;
            }
        }
        request.broadcast.emit('chat-message', {"message": data.message, "name": name, "role": role});
    });
    request.on('get-client-list', gameId => {
        var g = games[gameId].clients;
        request.emit('client-list', {"list": g});
        request.broadcast.emit('client-list', {"list": g});
    });
    request.on('start-game', gameId=> {
        var theGame = games[gameId];
        theGame.clients.forEach(c =>{
            c.role = getRandomRole();
        });
        io.emit('begin');
    });
    request.on('find-role', data=>{
        var role = "";
        var g = games[data.gameId];
        var clientId = data.clientId;
        for (i=0; i<g.clients.length; i++) {
            if (g.clients[i].clientId===clientId) {
                role = g.clients[i].role;
                break;
            }
        }
        request.emit('return-role', role);
    });
    request.on('message', message => {
        if (message.method === "create"){
            const clientId = message.clientId;
            const clientName= message.name;
            const gameId = uid.randomUUID(4).toUpperCase();
            games[gameId] = {
                "id": gameId,
                "clients": [] 
            }
            const payLoad = {
                "method": "create",
                "game" : games[gameId]
            }
            payLoad.game.clients.push({
                "clientId": clientId,
                "name": clientName,
                "role": role
            })
            request.emit('message', payLoad);
        }

        if (message.method === "join") {
            const clientId = message.clientId;
            const name = message.name;
            const gameId = message.gameId;
            const game = games[gameId];
            if (game.clients.length > 12) {
                return;
            }

            game.clients.push({
                "clientId": clientId,
                "name": name,
                "role": role
            })
            const payLoad = {
                "method": "join",
                "game": game
            }
            io.emit('message', payLoad);
        }
    })
    const clientId = uid.randomUUID(8);
    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }
    //send back the client connect
    io.emit('message', payLoad);
});
function getRandomRole(){
    // 1 seeker per 2 hiders
    let x = Math.floor(Math.random() * 3);
    if (x<=1) {
        return "Hider";
    }
    else {
        return "Seeker";
    }
}  
server.listen(80)