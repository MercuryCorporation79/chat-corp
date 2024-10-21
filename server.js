// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

let messages = [];

// Socket.IO logique
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté.');

    // Envoyer les messages actuels à un nouvel utilisateur
    socket.emit('loadMessages', messages);

    // Réception d'un nouveau message
    socket.on('message', (data) => {
        // Ajout du message à la mémoire
        messages.push(data);
        // Diffuser le message à tous les clients
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur est déconnecté.');
    });
});

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});