const server = io.connect('localhost:80')

var gameId = document.location.search.replace(/^.*?\=/, "");
document.getElementById("idDisplay").innerHTML = "Game Code: " + gameId;