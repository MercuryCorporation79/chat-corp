const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques (HTML, CSS, JS) depuis le dossier "public"
app.use(express.static(path.join(__dirname, 'public')));

// Stock temporaire pour les messages
let messages = [];

// Gérer la connexion des utilisateurs à Socket.IO
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    // Envoyer les anciens messages à l'utilisateur qui vient de se connecter
    socket.emit('loadMessages', messages);

    // Recevoir un nouveau message
    socket.on('message', (data) => {
        messages.push(data); // Ajouter le message dans le tableau de messages
        io.emit('message', data); // Diffuser le message à tous les utilisateurs connectés
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur est déconnecté');
    });
});

// Démarrer le serveur sur le port spécifié
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});