const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

let messages = [];

// Écouter les connexions des utilisateurs
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    // Envoyer les messages existants à l'utilisateur qui vient de se connecter
    socket.emit('loadMessages', messages);

    // Gérer l'envoi de messages
    socket.on('message', (data) => {
        messages.push(data);
        io.emit('message', data); // Envoyer le message à tous les clients
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur est déconnecté');
    });
});

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});