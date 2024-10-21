const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

let messages = []; // Tableau pour stocker les messages temporaires

io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    // Envoyer les anciens messages à l'utilisateur connecté
    socket.emit('loadMessages', messages);

    // Gérer la réception d'un nouveau message
    socket.on('message', (data) => {
        messages.push(data); // Ajouter le message dans le tableau des messages
        io.emit('message', data); // Répandre le message à tous les clients
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});

server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});