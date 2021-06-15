// client handlers, etc.
const server = io('http://localhost/')
let clientId = null;
let gameId = null;
let playerName = null;
let playerRole = null;

const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtGameId = document.getElementById("txtGameId");
const txtName = document.getElementById("txtName");
const divPlayers = document.getElementById("divPlayers");
const divBoard = document.getElementById("divBoard");


btnJoin.addEventListener("click", e => {
    if (gameId === null)
        gameId = txtGameId.value.toUpperCase();
    if (playerName === null)
        playerName = txtName.value; 
    const payLoad = {
        "method": "join",
        "clientId": clientId,
        "name": playerName,
        "gameId": gameId
    }
    server.emit('message', payLoad)
})

btnCreate.addEventListener("click", e => {
    if (playerName === null)
        playerName = txtName.value;
    const payLoad = {
        "method": "create",
        "name": playerName,
        "clientId": clientId
    }
    server.emit('message', payLoad)
})

server.on('message', message => {
    //message.data
    const response = message;
    //connect
    if (response.method === "connect"){
        clientId = response.clientId;
        console.log("Client id Set successfully " + clientId);
    }

    //create
    if (response.method === "create"){
        gameId = response.game.id;
        console.log("game successfully created with id " + gameId);
        window.location.href = "welcome.html" + "?gameData=" + gameId + ";" + clientId;
    }


    //update
    if (response.method === "update"){
        //{1: "red", 1}
        if (!response.game.state) return;
    }

    //join
    if (response.method === "join"){
        const game = response.game;
        game.clients.forEach (c => {
            const d = document.createElement("div");
            // d.style.width = "200px";
            // d.style.background = c.color
            d.textContent = c.clientId;
            divPlayers.appendChild(d);
            //if (c.clientId === clientId) playerColor = c.color;
        })
        gameId = response.game.id;
        window.location.href = "welcome.html" + "?gameData=" + gameId + ";" + clientId;
    }
})