document.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded, checking auth state...");

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("User is logged in:", user.email);
            // Only try to load progress if we're on the main page
            if (!window.location.pathname.includes('business-management')) {
                loadOverallProgress();
            }
        } else {
            console.log("No user logged in");
        }
    });
    
    // Verify progress elements exist
    const progressElements = {
        total: document.getElementById('total-questions'),
        correct: document.getElementById('correct-answers'),
        semicircle: document.querySelector('.semicircle'),
        percentage: document.querySelector('.percentage')
    };

    console.log("Progress elements found:", Object.keys(progressElements).filter(key => progressElements[key] !== null));
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("User is logged in:", user.email);
            // Only load progress if we're on the main page
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                loadOverallProgress();
            }
        } else {
            console.log("No user logged in");
            // Reset progress display
            if (progressElements.total) progressElements.total.textContent = '0';
            if (progressElements.correct) progressElements.correct.textContent = '0';
            if (progressElements.percentage) progressElements.percentage.textContent = '0%';
            if (progressElements.semicircle) progressElements.semicircle.style.setProperty('--progress', '0%');
        }
    });
});

function updateProgress(totalQuestions, correctAnswers) {
    const totalElement = document.getElementById('total-questions');
    const correctElement = document.getElementById('correct-answers');
    const semicircle = document.querySelector('.semicircle');
    const percentage = document.querySelector('.percentage');

    if (!totalElement || !correctElement || !semicircle || !percentage) {
        console.log("Progress display elements not found");
        return;
    }

    console.log(`Updating display with: ${correctAnswers}/${totalQuestions}`);

    // Update numbers
    totalElement.textContent = totalQuestions;
    correctElement.textContent = correctAnswers;
    
    // Calculate and update accuracy
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    semicircle.style.setProperty('--progress', `${accuracy}%`);
    percentage.textContent = `${Math.round(accuracy)}%`;
    
    console.log(`Updated accuracy to: ${accuracy}%`);
}

function saveQuizResult(category, totalQuestions, correctAnswers) {
    console.log("Saving quiz result:", { category, totalQuestions, correctAnswers });

    const result = {
        timestamp: new Date().toISOString(),
        category: category,
        totalQuestions: Number(totalQuestions),
        correctAnswers: Number(correctAnswers),
        accuracy: (correctAnswers / totalQuestions) * 100
    };

    // Save to localStorage immediately
    try {
        let localResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
        localResults.push(result);
        localStorage.setItem('quizResults', JSON.stringify(localResults));
        console.log("Saved to localStorage");
    } catch (e) {
        console.error("Error saving to localStorage:", e);
    }

    // Try to save to Firebase
    const user = firebase.auth().currentUser;
    if (!user) {
        console.error("No user logged in - saved to localStorage only");
        return Promise.resolve();
    }

    return firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .collection('quizResults')
        .add(result)
        .then(() => {
            console.log("Saved to Firebase successfully");
        })
        .catch(error => {
            console.error("Error saving to Firebase:", error);
            // We already saved to localStorage, so we can still show the results
            return Promise.resolve();
        });
}

// Add this function to manually trigger a progress update
function refreshProgress() {
    console.log("Manually refreshing progress...");
    if (firebase.auth().currentUser) {
        loadOverallProgress()
            .then(() => console.log("Progress refreshed successfully"))
            .catch(error => console.error("Error refreshing progress:", error));
    }
}

// Update loadOverallProgress to return a Promise
function loadOverallProgress() {
    console.log("Loading overall progress...");
    const user = firebase.auth().currentUser;
    
    if (!user) {
        console.log("No user logged in");
        return;
    }

    // Try to get data from localStorage first
    try {
        const localResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
        let totalQuestions = 0;
        let totalCorrect = 0;

        localResults.forEach(result => {
            totalQuestions += Number(result.totalQuestions);
            totalCorrect += Number(result.correctAnswers);
        });

        console.log("Local storage totals:", { totalQuestions, totalCorrect });
        updateProgressDisplay(totalQuestions, totalCorrect);
    } catch (e) {
        console.error("Error reading from localStorage:", e);
    }

    // Then try to get from Firebase
    firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .collection('quizResults')
        .get()
        .then(querySnapshot => {
            let totalQuestions = 0;
            let totalCorrect = 0;

            querySnapshot.forEach(doc => {
                const data = doc.data();
                totalQuestions += Number(data.totalQuestions);
                totalCorrect += Number(data.correctAnswers);
            });

            console.log("Firebase totals:", { totalQuestions, totalCorrect });
            updateProgressDisplay(totalQuestions, totalCorrect);
        })
        .catch(error => {
            console.error("Error loading from Firebase:", error);
            // We already displayed localStorage data as fallback
        });
}

// Separate function to update the display
function updateProgressDisplay(totalQuestions, totalCorrect) {
    const totalElement = document.getElementById('total-questions');
    const correctElement = document.getElementById('correct-answers');
    const semicircle = document.querySelector('.semicircle');
    const percentage = document.querySelector('.percentage');

    if (!totalElement || !correctElement || !semicircle || !percentage) {
        console.error("Progress elements not found");
        return;
    }

    console.log("Updating display with:", { totalQuestions, totalCorrect });

    totalElement.textContent = totalQuestions;
    correctElement.textContent = totalCorrect;
    
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    semicircle.style.setProperty('--progress', `${accuracy}%`);
    percentage.textContent = `${Math.round(accuracy)}%`;
    
    console.log(`Updated accuracy to: ${accuracy}%`);
}