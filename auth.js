// ... existing code ...
const firebaseConfig = {
    apiKey: "AIzaSyCsXSRygjdQu_jbQUYjsSJqwZPnS_vxwPk",
    authDomain: "decawebsite-e3fc4.firebaseapp.com",
    projectId: "decawebsite-e3fc4",
    storageBucket: "decawebsite-e3fc4.firebasestorage.app",
    messagingSenderId: "994503018592",
    appId: "1:994503018592:web:f719802ae0597163541b05"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Auth
const auth = firebase.auth();

// Wait for DOM to load before getting elements
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const userInfo = document.getElementById('user-info');
    const userPic = document.getElementById('user-pic');
    const userName = document.getElementById('user-name');

    // Sign in with Google
    function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log('Successfully signed in:', result.user.displayName);
            })
            .catch((error) => {
                console.error('Error signing in:', error);
                console.log('Error details:', error.code, error.message);
                alert('Failed to sign in. Please try again.');
            });
    }

    // Sign out
    function signOut() {
        auth.signOut()
            .then(() => {
                console.log('Successfully signed out');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
                alert('Failed to sign out. Please try again.');
            });
    }

    // Auth state observer
    auth.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user ? 'logged in' : 'logged out');
        if (user) {
            // User is signed in
            if (loginButton) loginButton.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            if (userPic) userPic.src = user.photoURL || 'default-profile-pic.png';
            if (userName) userName.textContent = user.displayName;
            
            // Save user data to localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
            }));
        } else {
            // User is signed out
            if (loginButton) loginButton.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
            
            // Clear user data from localStorage
            localStorage.removeItem('user');
        }
    });

    // Add click event listeners
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            console.log('Login button clicked');
            signInWithGoogle();
        });
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', signOut);
    }
});