const express = require('express');  
const { Server } = require('http');
const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/connect.html');
});

const clients = {};
const games = {};


io.on('request', request => {

    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"))
    connection.on("close", () => console.log("closed!"))
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)
        if (result.method === "create"){
            const clientId = result.clientId ;
            const gameId = guid();
            games[gameId] = {
                "id": gameId,
                "clients": [] 
            }
            const payLoad = {
                "method": "create",
                "game" : games[gameId]
            }
            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }

        if (result.method === "join") {

            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            if (game.clients.length > 12) 
            {
                return;
            }
            // how to choose if client is hider or seeker
            // const role = null;
            // for (int x = 0; x < game.clients.length; x++){
            //     if ((Math.random()*10) % 2 === 0  ){
            //         role  = "Hider";
            //     }
            //     else    
            //         role = "seeker";
            // }
            game.clients.push({
                "clientId": clientId,
                //"role": role
            })
            //if (game.clients.length === 3) updateGameState();

            const payLoad = {
                "method": "join",
                "game": game
            }
            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            })
        }
    })
    const clientId = guid();
    clients[clientId] = {
        "connection":  connection
    }

    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }
    //send back the client connect
    connection.send(JSON.stringify(payLoad))

})    
server.listen(80)