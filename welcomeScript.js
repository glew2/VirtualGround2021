const server = io.connect('localhost:80')

var namesContainer = document.getElementById('divPlayers');
var clientList = null;
var gameData = document.location.search.replace(/^.*?\=/, "").split(";");
var gameId = gameData[0];
var clientId = gameData[1];
var BUTTON_CREATED = false;
document.getElementById("idDisplay").innerHTML = "Game Code: " + gameId;
server.emit('get-client-list', gameId);
server.on('client-list', listContainer => {
    while(divPlayers.firstChild)
        divPlayers.removeChild (divPlayers.firstChild)
    clientList=listContainer.list;
    if (clientId===clientList[0].clientId) {// if this client is the host
        if (!BUTTON_CREATED) {
            var button= document.createElement("button");
            button.appendChild(document.createTextNode("START GAME"));
            button.onclick=(e=>{
                server.emit('start-game', gameId);
                window.location.href = "index.html";
                // send to different page based on role
            });
            document.getElementById("buttonHolder").appendChild(button);
            BUTTON_CREATED = true;
        }
    }
    clientList.forEach(function(c) {
        const messageElement = document.createElement('div');
        messageElement.innerText = c.name;
        namesContainer.append(messageElement);
    });
});
server.on('begin', () => {
    // TODO send to different page based on role
    window.location.href = "index.html";
});