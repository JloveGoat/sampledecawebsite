import { getFirestore, doc, setDoc, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

const db = getFirestore();
const auth = getAuth();

// Function to log a completed question
export async function logQuestionCompleted(questionId, isCorrect) {
    const user = auth.currentUser;
    if (!user) {
        console.log('No user logged in');
        return;
    }

    try {
        const userProgressRef = doc(db, 'userProgress', user.uid);
        const userProgressDoc = await getDoc(userProgressRef);

        if (!userProgressDoc.exists()) {
            // Create new progress document
            await setDoc(userProgressRef, {
                totalQuestionsAnswered: 1,
                correctAnswers: isCorrect ? 1 : 0,
                questionHistory: [{
                    questionId: questionId,
                    correct: isCorrect,
                    timestamp: new Date().toISOString()
                }]
            });
        } else {
            // Update existing progress
            const currentData = userProgressDoc.data();
            await updateDoc(userProgressRef, {
                totalQuestionsAnswered: (currentData.totalQuestionsAnswered || 0) + 1,
                correctAnswers: (currentData.correctAnswers || 0) + (isCorrect ? 1 : 0),
                questionHistory: [...(currentData.questionHistory || []), {
                    questionId: questionId,
                    correct: isCorrect,
                    timestamp: new Date().toISOString()
                }]
            });
        }
        console.log('Progress updated successfully');
        // Update display after logging
        displayProgress();
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

// Function to get user progress
export async function getUserProgress() {
    const user = auth.currentUser;
    if (!user) {
        console.log('No user logged in');
        return null;
    }

    try {
        const userProgressRef = doc(db, 'userProgress', user.uid);
        const userProgressDoc = await getDoc(userProgressRef);

        if (!userProgressDoc.exists()) {
            return {
                totalQuestionsAnswered: 0,
                correctAnswers: 0,
                questionHistory: []
            };
        }

        return userProgressDoc.data();
    } catch (error) {
        console.error('Error getting progress:', error);
        return null;
    }
}

// Function to display progress
export async function displayProgress() {
    const progress = await getUserProgress();
    if (progress) {
        const progressDiv = document.getElementById('progress-display');
        if (progressDiv) {
            progressDiv.innerHTML = `
                <h3>Your Progress</h3>
                <p>Total Questions Answered: ${progress.totalQuestionsAnswered}</p>
                <p>Correct Answers: ${progress.correctAnswers}</p>
                <p>Accuracy: ${((progress.correctAnswers / progress.totalQuestionsAnswered) * 100 || 0).toFixed(1)}%</p>
            `;
        }
    }
}

// Call displayProgress when the page loads
document.addEventListener('DOMContentLoaded', displayProgress);