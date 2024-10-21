const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', function connection(ws) {
    console.log('Un utilisateur est connecté.');

    ws.on('message', function incoming(message) {
        console.log('Reçu:', message);

        // Réenvoyer le message à tous les clients connectés
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', function close() {
        console.log('Un utilisateur est déconnecté.');
    });
});

server.listen(3000, function() {
    console.log('Le serveur est en écoute sur le port 3000');
});