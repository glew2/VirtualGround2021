const server = io.connect('localhost:80');

var gameData = document.location.search.replace(/^.*?\=/, "").split(";");
var gameId = gameData[0];
var clientId = gameData[1];