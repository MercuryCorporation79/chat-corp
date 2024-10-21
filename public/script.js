// script.js
const socket = io();

const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const chatBox = document.querySelector('.chat-box');

const displayedMessages = new Set(); // Set pour stocker les messages affichés

// Fonction de chiffrement
function encryptMessage(message) {
    const passphrase = 'MercuryCorporation19992024';
    return CryptoJS.AES.encrypt(message, passphrase).toString();
}

// Fonction pour déchiffrer les messages
function decryptMessage(ciphertext) {
    const passphrase = 'MercuryCorporation19992024';
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Ajouter un message dans la boîte de discussion
function addMessageToChatBox(username, message, encrypted = false) {
    const displayedMessage = encrypted ? decryptMessage(message) : message;
    const messageKey = `${username}:${displayedMessage}`; // Clé unique pour le message

    // Vérifiez si le message a déjà été affiché
    if (!displayedMessages.has(messageKey)) {
        displayedMessages.add(messageKey); // Ajoutez le message à l'ensemble
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message');
        messageBubble.innerHTML = `<strong>${username}:</strong> ${displayedMessage}`;
        chatBox.appendChild(messageBubble);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Envoyer un message
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        const username = sessionStorage.getItem('username');
        const encryptedMessage = encryptMessage(message);
        
        // Émettre le message au serveur
        socket.emit('message', { username, message: encryptedMessage });

        // Ajouter le message non chiffré à l'interface utilisateur
        addMessageToChatBox(username, message); 
        messageInput.value = '';
    }
});

// Recevoir les messages du serveur
socket.on('message', (data) => {
    addMessageToChatBox(data.username, data.message, true); // Afficher message chiffré
});

// Charger les anciens messages
socket.on('loadMessages', (messages) => {
    messages.forEach(data => {
        addMessageToChatBox(data.username, data.message, true);
    });
});