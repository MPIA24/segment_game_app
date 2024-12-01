// Select DOM elements
const menuButton = document.getElementById('menu-button');
const menuContent = document.getElementById('menu-content');
const logoutButton = document.getElementById('logout-button');
const authNotConnected = document.getElementById('auth-not-connected');
const authConnected = document.getElementById('auth-connected');


// Toggle menu visibility
menuButton.addEventListener('click', () => {
  menuContent.classList.toggle('hidden');
});


function disconnectUser() {
  document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  updateAuthState();
}

// Update UI based on connection state
function isUserConnected() {
  const userId = getUserIdFromCookie();
  return userId!== null;
}

function getUserIdFromCookie() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('user_id=')) {
      return parseInt(cookie.split('=')[1]);
    }
  }
  return null;
}
function updateAuthState() {
  if (isUserConnected()) {
    authNotConnected.classList.add('hidden');
    authConnected.classList.remove('hidden');
  } else {
    authNotConnected.classList.remove('hidden');
    authConnected.classList.add('hidden');
  }
}

// Initial state
updateAuthState();

logoutButton.addEventListener('click', () => {
  disconnectUser();
  location.reload('/index.html');
});

