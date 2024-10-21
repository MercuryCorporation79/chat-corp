// Se connecter à Socket.IO
const socket = io();

// Références aux éléments de l'interface utilisateur
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const chatBox = document.querySelector('.chat-box');

// Fonction pour ajouter un message dans l'interface utilisateur
function addMessageToChatBox(username, message) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message');
    messageBubble.innerHTML = `<strong>${username}:</strong> ${message}`;
    chatBox.appendChild(messageBubble);
    chatBox.scrollTop = chatBox.scrollHeight; // Faire défiler vers le bas automatiquement
}

// Envoyer le message lorsque l'utilisateur clique sur "Envoyer"
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        const username = sessionStorage.getItem('username') || 'Anonyme';
        socket.emit('message', { username, message }); // Envoyer le message au serveur
        addMessageToChatBox(username, message); // Ajouter le message dans la boîte de chat
        messageInput.value = ''; // Vider le champ de saisie après l'envoi
    }
});

// Réception des messages du serveur
socket.on('message', (data) => {
    addMessageToChatBox(data.username, data.message);
});

// Charger les anciens messages lors de la connexion
socket.on('loadMessages', (messages) => {
    messages.forEach(messageData => {
        addMessageToChatBox(messageData.username, messageData.message);
    });
});