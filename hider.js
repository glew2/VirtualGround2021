const server = io.connect('localhost:80');

var gameData = document.location.search.replace(/^.*?\=/, "").split(";");
var gameId = gameData[0];
var clientId = gameData[1];
var role = gameData[2];

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')


server.on('chat-message', data => {
  if (data.role===role) {
    appendMessage(`${data.name}: ${data.message}`)
  }  
});

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  server.emit('send-chat-message', {"message": message, "gameId": gameId, "clientId": clientId});
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}