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
    console.log("Attempting to save quiz result...");
    
    const user = firebase.auth().currentUser;
    
    if (!user) {
        console.error("No user logged in - cannot save results");
        return Promise.reject("No user logged in");
    }

    // Create the result object
    const result = {
        timestamp: firebase.firestore.Timestamp.now(),  // Use Firebase timestamp
        category: category,
        totalQuestions: Number(totalQuestions),  // Ensure numbers, not strings
        correctAnswers: Number(correctAnswers),
        accuracy: (correctAnswers / totalQuestions) * 100
    };

    console.log("Saving result:", result);

    // Return the save promise
    return firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .collection('quizResults')
        .add(result)
        .then(() => {
            console.log("Quiz result saved to Firestore successfully!");
            // Try to update local storage as backup
            try {
                let localResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
                localResults.push(result);
                localStorage.setItem('quizResults', JSON.stringify(localResults));
                console.log("Result also saved to localStorage");
            } catch (e) {
                console.warn("Could not save to localStorage:", e);
            }
        })
        .catch(error => {
            console.error("Firebase save error:", error);
            // Still try to save locally if Firebase fails
            try {
                let localResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
                localResults.push(result);
                localStorage.setItem('quizResults', JSON.stringify(localResults));
                console.log("Saved to localStorage as backup");
            } catch (e) {
                console.error("Complete save failure:", e);
            }
            throw error; // Re-throw to handle in calling code
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
    return new Promise((resolve, reject) => {
        const user = firebase.auth().currentUser;
        
        if (!user) {
            console.error("No user logged in");
            return reject("No user logged in");
        }

        console.log("Loading progress for user:", user.uid);

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

                console.log(`Loaded totals: ${totalCorrect}/${totalQuestions}`);

                // Update UI elements if they exist
                const elements = {
                    total: document.getElementById('total-questions'),
                    correct: document.getElementById('correct-answers'),
                    semicircle: document.querySelector('.semicircle'),
                    percentage: document.querySelector('.percentage')
                };

                if (elements.total && elements.correct) {
                    elements.total.textContent = totalQuestions;
                    elements.correct.textContent = totalCorrect;
                    
                    if (elements.semicircle && elements.percentage) {
                        const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
                        elements.semicircle.style.setProperty('--progress', `${accuracy}%`);
                        elements.percentage.textContent = `${Math.round(accuracy)}%`;
                    }
                }

                resolve({ totalQuestions, totalCorrect });
            })
            .catch(error => {
                console.error("Error loading progress:", error);
                reject(error);
            });
    });
}