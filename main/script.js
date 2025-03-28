function updateProgress(totalQuestions, correctAnswers) {
    // Update numbers
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('correct-answers').textContent = correctAnswers;
    
    // Calculate and update accuracy
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const semicircle = document.querySelector('.semicircle');
    const percentage = document.querySelector('.percentage');
    
    semicircle.style.setProperty('--progress', `${accuracy}%`);
    percentage.textContent = `${Math.round(accuracy)}%`;
}

// Example usage:
// updateProgress(10, 7); // 70% accuracy

// ... existing updateProgress function ...

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
            updateProgress(totalQuestions, correctAnswers); // Use existing updateProgress function
        })
        .catch((error) => {
            console.error("Error saving quiz result:", error);
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