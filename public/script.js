document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const sendButton = document.getElementById("sendButton");
    const messageInput = document.getElementById("message");
    const chatbox = document.getElementById("chatbox");
    const validUsers = ["ScorpiusBlack", "MiaBlack"];
    const key = 'MercuryCorporation19992024';

    // Gestion de la connexion
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const username = document.getElementById("username").value;

            if (validUsers.includes(username)) {
                localStorage.setItem("username", username);
                window.location.href = "/chat.html";
            } else {
                alert("Nom d'utilisateur invalide !");
            }
        });
    }

    // Gestion de l'envoi des messages
    if (sendButton) {
        sendButton.addEventListener("click", sendMessage);
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        const username = localStorage.getItem("username");

        if (message !== "" && username) {
            // Si tu veux vraiment chiffrer, active cette ligne :
            // const encryptedMessage = encryptMessage(message);
            // Si tu veux envoyer directement en clair, envoie simplement le message :
            displayMessage(username, message); // Pas de chiffrement pour l'affichage direct
            messageInput.value = "";

            // Envoi au serveur WebSocket ici si besoin.
        }
    }

    function displayMessage(username, message) {
        const messageBubble = document.createElement("div");
        messageBubble.classList.add("message-bubble");

        const userTag = document.createElement("p");
        userTag.classList.add("username");
        userTag.innerText = username;

        const messageContent = document.createElement("p");
        messageContent.classList.add("message-content");
        
        // Si tu as besoin de déchiffrer le message, active cette ligne :
        // const decryptedMessage = decryptMessage(message); 
        // Si tu n'utilises pas le chiffrement, affiche directement :
        messageContent.innerText = message; // Remplacer par decryptedMessage si besoin

        messageBubble.appendChild(userTag);
        messageBubble.appendChild(messageContent);

        chatbox.appendChild(messageBubble);
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll auto vers le bas
    }

    function encryptMessage(message) {
        return btoa(message); // Encode en base64
    }

    function decryptMessage(message) {
        return atob(message); // Decode en base64
    }
});