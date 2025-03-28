// Import and configure Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsXSRygjdQu_jbQUYjsSJqwZPnS_vxwPk",
    authDomain: "decawebsite-e3fc4.firebaseapp.com",
    projectId: "decawebsite-e3fc4",
    storageBucket: "decawebsite-e3fc4.firebasestorage.app",
    messagingSenderId: "994503018592",
    appId: "1:994503018592:web:f719802ae0597163541b05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up auth...'); // Debug log
    
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const userInfo = document.getElementById('user-info');
    const userPic = document.getElementById('user-pic');
    const userName = document.getElementById('user-name');

    // Sign in with Google
    function signInWithGoogle() {
        console.log('Attempting Google sign in...'); // Debug log
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log('Successfully signed in:', result.user.displayName);
                const user = result.user;
                // Save user data to localStorage
                localStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                }));
            })
            .catch((error) => {
                console.error('Error signing in:', error);
                console.log('Error details:', error.code, error.message);
                alert('Failed to sign in. Please try again.');
            });
    }

    // Sign out
    function signOut() {
        console.log('Attempting sign out...'); // Debug log
        auth.signOut()
            .then(() => {
                console.log('Successfully signed out');
                localStorage.removeItem('user');
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
        } else {
            // User is signed out
            if (loginButton) loginButton.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
        }
    });

    // Add click event listeners
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            console.log('Login button clicked'); // Debug log
            signInWithGoogle();
        });
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', signOut);
    }
});

function saveQuizResult(category, totalQuestions, correctAnswers) {
    // Get the current user
    const user = firebase.auth().currentUser;
    
    if (!user) {
        console.log("No user logged in");
        return;
    }

    // Create a new result object
    const result = {
        timestamp: new Date().toISOString(),
        category: category,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
        accuracy: (correctAnswers / totalQuestions) * 100
    };

    // Save to Firebase
    firebase.firestore().collection('users')
        .doc(user.uid)
        .collection('quizResults')
        .add(result)
        .then(() => {
            console.log("Quiz result saved successfully");
            updateProgressDisplay(); // We'll create this function next
        })
        .catch((error) => {
            console.error("Error saving quiz result:", error);
        });
}