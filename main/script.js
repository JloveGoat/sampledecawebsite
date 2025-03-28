function updateProgress(totalQuestions, correctAnswers) {
    const totalElement = document.getElementById('total-questions');
    const correctElement = document.getElementById('correct-answers');
    const semicircle = document.querySelector('.semicircle');
    const percentage = document.querySelector('.percentage');

    if (!totalElement || !correctElement || !semicircle || !percentage) {
        console.log("Progress display elements not found");
        return;
    }

    // Update numbers
    totalElement.textContent = totalQuestions;
    correctElement.textContent = correctAnswers;
    
    // Calculate and update accuracy
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    semicircle.style.setProperty('--progress', `${accuracy}%`);
    percentage.textContent = `${Math.round(accuracy)}%`;
}

// Example usage:
// updateProgress(10, 7); // 70% accuracy

// ... existing updateProgress function ...

function saveQuizResult(category, totalQuestions, correctAnswers) {
    console.log("Attempting to save quiz result...");
    console.log(`Category: ${category}, Score: ${correctAnswers}/${totalQuestions}`);

    const user = firebase.auth().currentUser;
    
    if (!user) {
        console.log("No user logged in - cannot save results");
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

    console.log("Saving result:", result);

    // Save to Firebase
    return firebase.firestore().collection('users')
        .doc(user.uid)
        .collection('quizResults')
        .add(result)
        .then(() => {
            console.log("Quiz result saved successfully!");
            // After saving, load overall progress
            return loadOverallProgress();
        })
        .catch((error) => {
            console.error("Error saving quiz result:", error);
            throw error;
        });
}

function loadOverallProgress() {
    const user = firebase.auth().currentUser;
    
    if (!user) {
        console.log("No user logged in");
        return;
    }

    // Get all quiz results for the user
    firebase.firestore().collection('users')
        .doc(user.uid)
        .collection('quizResults')
        .get()
        .then((querySnapshot) => {
            let totalQuestions = 0;
            let totalCorrect = 0;

            querySnapshot.forEach((doc) => {
                const result = doc.data();
                totalQuestions += result.totalQuestions;
                totalCorrect += result.correctAnswers;
            });

            // Update the progress display with overall totals
            updateProgress(totalQuestions, totalCorrect);
        })
        .catch((error) => {
            console.error("Error loading progress:", error);
        });
}

// Call loadOverallProgress when the page loads
document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            loadOverallProgress();
        }
    });
});