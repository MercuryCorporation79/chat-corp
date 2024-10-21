// script.js
const loginButton = document.getElementById('loginButton');
const usernameInput = document.getElementById('usernameInput');
const errorMessage = document.getElementById('errorMessage');

const allowedUsernames = ['ScorpiusBlack', 'MiaBlack']; // Liste des noms d'utilisateur autorisés

// Fonction de connexion
function login() {
    const enteredUsername = usernameInput.value.trim();
    if (allowedUsernames.includes(enteredUsername)) {
        sessionStorage.setItem('username', enteredUsername); // Stocker le nom d'utilisateur
        window.location.href = 'chat.html'; // Rediriger vers la page de chat
    } else {
        errorMessage.innerText = 'Nom d\'utilisateur non autorisé. Veuillez essayer un autre nom.';
        errorMessage.style.display = 'block'; // Afficher le message d'erreur
    }
}

// Événement de connexion
loginButton.addEventListener('click', login);