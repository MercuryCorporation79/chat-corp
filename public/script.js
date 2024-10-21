document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    const chatBox = document.querySelector(".chat-box");
    
    // Fonction pour chiffrer les messages
    function encryptMessage(message, secretKey) {
        return CryptoJS.AES.encrypt(message, secretKey).toString();
    }

    // Fonction pour déchiffrer les messages
    function decryptMessage(encryptedMessage, secretKey) {
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    // Afficher le message dans le chat
    function appendMessage(username, message, isSender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        
        // Style de la bulle de message
        if (isSender) {
            messageElement.style.alignSelf = "flex-end"; // Messages envoyés à droite
        } else {
            messageElement.style.alignSelf = "flex-start"; // Messages reçus à gauche
        }
        
        messageElement.innerHTML = `<strong>${username}</strong> ${message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Toujours scroller vers le bas
    }

    // Envoyer un message
    function sendMessage() {
        const message = messageInput.value;
        const secretKey = "MercuryCorporation19992024"; // Ta clé de chiffrement
        const encryptedMessage = encryptMessage(message, secretKey);

        appendMessage("ScorpiusBlack", message, true); // Message visible
        messageInput.value = ""; // Vider le champ
        // Envoi du message chiffré au serveur ou à l'autre utilisateur
    }

    // S'assurer que l'événement est ajouté une seule fois
    sendButton.removeEventListener("click", sendMessage); // Retire tout ancien événement
    sendButton.addEventListener("click", sendMessage); // Ajoute l'événement proprement

    // Permettre l'envoi en appuyant sur la touche Entrée
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Empêcher le saut de ligne
            sendMessage(); // Envoyer le message
        }
    });
});