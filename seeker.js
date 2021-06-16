const server = io.connect('localhost:80');

var gameData = document.location.search.replace(/^.*?\=/, "").split(";");
var gameId = gameData[0];
var clientId = gameData[1];
var role = gameData[2];

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const submitJailed = document.getElementById('jailsend-button');
const submitEscaped = document.getElementById('escapesend-button');
const inputJailed = document.getElementById('jailmessage-input');
const inputEscaped = document.getElementById('escapemessage-input');

submitJailed.addEventListener("click", e => {
    e.preventDefault();
    var player = inputJailed.value;
    var message = "Reported player" + player + " as jailed!";
    appendMessage("You reported player " + player + " as jailed!");
    server.emit('send-chat-message', {"message":message, "gameId": gameId, "clientId": clientId})
    inputJailed.value = '';
});
submitEscaped.addEventListener("click", e => {
    e.preventDefault();
    var player = inputEscaped.value;
    var message = "Reported player" + player + " as escaped!";
    appendMessage("You reported player " + player + " as escaped!");
    server.emit('send-chat-message', {"message":message, "gameId": gameId, "clientId": clientId})
    inputEscaped.value = '';
})
server.on('chat-message', data => {
  if (data.role===role) {
    appendMessage(`${data.name}: ${data.message}`)
  }
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  server.emit('send-chat-message', {"message":message, "gameId": gameId, "clientId": clientId})
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}