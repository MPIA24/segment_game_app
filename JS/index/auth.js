// Gestion de la connexion
// Gestion de la connexion
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    const messageBox = document.getElementById('message');
    if (response.ok) {
        messageBox.textContent = 'Connexion réussie !';
        messageBox.style.color = 'green';

        // Stocker le user_id dans un cookie de session
        document.cookie = `user_id=${result.user_id}; path=/;`;

        // Rediriger l'utilisateur
        window.location.href = 'index.html'; // Exemple : redirection vers une page de tableau de bord
    } else {
        messageBox.textContent = result.message || 'Une erreur est survenue.';
    }
});

// Fonction utilitaire pour lire un cookie par nom
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Exemple d'utilisation pour vérifier l'utilisateur connecté
const userId = getCookie('user_id');
if (userId) {
    console.log(`Utilisateur connecté avec ID : ${userId}`);
}


// Gestion de l'inscription
document.getElementById('registerForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password_confirmation = document.getElementById('password_confirmation').value;

    const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, password_confirmation })
    });

    const result = await response.json();

    const messageBox = document.getElementById('message');
    if (response.ok) {
        messageBox.textContent = 'Inscription réussie !';
        messageBox.style.color = 'green';

        // Redirection vers la page de connexion
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        messageBox.textContent = result.message || 'Une erreur est survenue.';
    }
});
