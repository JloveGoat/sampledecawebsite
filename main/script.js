// Auth state listener
document.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded, checking auth state...");
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("User is logged in:", user.email);
            loadOverallProgress();
        } else {
            console.log("No user logged in");
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
    console.log("Loading overall progress...");
    const user = firebase.auth().currentUser;
    
    if (!user) {
        console.log("No user logged in in loadOverallProgress");
        return;
    }

    console.log("Fetching results for user:", user.uid);

    // Get all quiz results for the user
    firebase.firestore().collection('users')
        .doc(user.uid)
        .collection('quizResults')
        .get()
        .then((querySnapshot) => {
            let totalQuestions = 0;
            let totalCorrect = 0;

            console.log("Found results:", querySnapshot.size);

            querySnapshot.forEach((doc) => {
                const result = doc.data();
                console.log("Processing result:", result);
                totalQuestions += result.totalQuestions;
                totalCorrect += result.correctAnswers;
            });

            console.log(`Updating progress with: ${totalCorrect}/${totalQuestions}`);
            updateProgress(totalQuestions, totalCorrect);
        })
        .catch((error) => {
            console.error("Error loading progress:", error);
        });
}