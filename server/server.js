const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const crypto = require('crypto');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = ["ScorpiusBlack", "MiaBlack"]; // Utilisateurs valides
let messages = []; // Stocker les messages

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
    let currentUser = null;

    socket.on('join', (username) => {
        if (users.includes(username)) {
            currentUser = username;
            console.log(`${username} connecté`);
            socket.emit('loadMessages', messages);
        } else {
            socket.disconnect(); // Déconnexion si utilisateur non valide
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

// Chiffrement des messages
function encryptMessage(message) {
    const cipher = crypto.createCipher('aes-256-cbc', 'secret-key');
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Suppression des messages après 24 heures
setInterval(() => {
    const now = Date.now();
    messages = messages.filter(msg => now - msg.timestamp < 86400000);  // 24 heures
}, 60000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});