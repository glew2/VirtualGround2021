const server = io.connect('localhost:80')

var namesContainer = document.getElementById('divPlayers')
var clientList = null;
var gameId = document.location.search.replace(/^.*?\=/, "");
document.getElementById("idDisplay").innerHTML = "Game Code: " + gameId;
server.emit('get-client-list', gameId);//also have to update clientlist
server.on('client-list', listContainer => {
    clientList=listContainer.list;
    listContainer.list.forEach(function(c) {
        const messageElement = document.createElement('div');
        messageElement.innerText = c.name;
        namesContainer.append(messageElement);
    });
});