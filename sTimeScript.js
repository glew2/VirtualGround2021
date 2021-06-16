const server = io.connect('localhost:80');

var timer = 30;
var gameData = document.location.search.replace(/^.*?\=/, "").split(";");
var gameId = gameData[0];
var clientId = gameData[1];
var role = gameData[2];
setInterval(()=>{
    document.getElementById('timer').innerHTML = timer + " seconds until seeking time!";
    timer--;
}, 1000);
setTimeout(()=>{
    window.location.href = "seeker.html" + "?gameData=" + gameId + ";" + clientId + ";" + role;
}, 30000);
