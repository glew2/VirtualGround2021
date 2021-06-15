const server = io.connect('localhost:80')

var clientList;
var namesContainer = document.getElementById('divPlayers')
var gameId = document.location.search.replace(/^.*?\=/, "");
document.getElementById("idDisplay").innerHTML = "Game Code: " + gameId;
server.emit('get-client-list', gameId);//also have to update clientlist
server.on('client-list', listContainer => {
    clientList = listContainer.list;
})
// for-each client in clientlist add HTML element with their name.
// ERROR (couldnt fix it 12:44 AM 6/15/21):
// Uncaught TypeError: Cannot read property 'forEach' of undefined
clientList.forEach(function(c) {
    const messageElement = document.createElement('div');
    messageElement.innerText = c.name;
    namesContainer.append(messageElement);
});