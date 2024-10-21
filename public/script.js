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
            const encryptedMessage = encryptMessage(message);
            displayMessage(username, encryptedMessage);
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
        messageContent.innerText = message;

        messageBubble.appendChild(userTag);
        messageBubble.appendChild(messageContent);

        chatbox.appendChild(messageBubble);
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll auto vers le bas
    }

    function encryptMessage(message) {
        // Exemple d'encryptage simple pour l'exercice
        return btoa(message); // Encode en base64
    }
});