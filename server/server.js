const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const crypto = require('crypto');  // Pour chiffrer les messages
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = ["ScorpiusBlack", "MiaBlack"];  // Seuls ces deux utilisateurs peuvent se connecter
let messages = []; // Pour stocker temporairement les messages

// Configurer le dossier public pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Vérifier si l'utilisateur est valide
io.on('connection', (socket) => {
    let currentUser = null;

    socket.on('join', (username) => {
        if (users.includes(username)) {
            currentUser = username;
            console.log(`${username} connecté`);
            socket.emit('loadMessages', messages);
        } else {
            socket.disconnect();  // Déconnecte si l'utilisateur n'est pas valide
        }
    });

    socket.on('message', (data) => {
        const encryptedMessage = encryptMessage(data.message);
        const msg = { username: currentUser, message: encryptedMessage, timestamp: Date.now() };
        messages.push(msg);
        io.emit('message', { username: currentUser, message: encryptedMessage });
    });

    socket.on('disconnect', () => {
        console.log(`${currentUser} déconnecté`);
    });
});

// Chiffrer un message
function encryptMessage(message) {
    const cipher = crypto.createCipher('aes-256-cbc', 'secret-key');
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Déchiffrer un message
function decryptMessage(encrypted) {
    const decipher = crypto.createDecipher('aes-256-cbc', 'secret-key');
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Supprimer les messages après 24 heures
setInterval(() => {
    const now = Date.now();
    messages = messages.filter(msg => now - msg.timestamp < 86400000);  // 24 heures
}, 60000); // Vérification toutes les minutes

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});