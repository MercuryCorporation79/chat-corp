// Se connecter à Socket.IO
const socket = io();

// Références aux éléments de l'interface utilisateur
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const chatBox = document.querySelector('.chat-box');

// Fonction pour ajouter le message dans l'interface utilisateur
function addMessageToChatBox(username, message) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message');
    messageBubble.innerHTML = `<strong>${username}:</strong> ${message}`;
    chatBox.appendChild(messageBubble);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll vers le bas
}

// Écouter l'événement de clic sur le bouton d'envoi
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        const username = sessionStorage.getItem('username');
        socket.emit('message', { username, message });
        addMessageToChatBox(username, message); // Ajouter le message directement dans le chat pour l'envoyeur
        messageInput.value = ''; // Effacer le champ d'entrée après l'envoi
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