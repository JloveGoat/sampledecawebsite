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
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

document.getElementById('googleLogin').addEventListener('click', () => {
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log('User signed in:', result.user);
            // Save user data to local storage or database
        })
        .catch((error) => {
            console.error('Error signing in:', error);
        });
});

const userId = result.user.uid; // Get user ID
const userProgress = { /* your progress data */ };

// Save to Firestore
firebase.firestore().collection('users').doc(userId).set(userProgress)
    .then(() => {
        console.log('User progress saved!');
    })
    .catch((error) => {
        console.error('Error saving progress:', error);
    });