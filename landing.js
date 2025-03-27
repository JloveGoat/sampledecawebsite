function saveUserProgress(quizResults) {
    const user = auth.currentUser;
    if (!user) {
        console.log('User must be signed in to save progress');
        return;
    }

    const userProgress = {
        timestamp: new Date().toISOString(),
        score: quizResults.score,
        totalQuestions: quizResults.totalQuestions,
        wrongQuestions: quizResults.wrongQuestions,
        topics: quizResults.topics || [] // Add topics tracking
    };

    try {
        // Save to localStorage
        const savedProgress = JSON.parse(localStorage.getItem(`progress_${user.uid}`) || '[]');
        savedProgress.push(userProgress);
        localStorage.setItem(`progress_${user.uid}`, JSON.stringify(savedProgress));
        console.log('Progress saved successfully');
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

// Modified checkAnswers function
function checkAnswers() {
    if (currentAnswers.includes(null)) {
        document.getElementById('results').innerHTML = 'Please answer all questions!';
        return;
    }

    let score = 0;
    let feedback = '';
    const wrongAnswers = [];

    currentAnswers.forEach((answer, index) => {
        if (answer === selectedQuestions[index].correctAnswer) {
            score++;
        } else {
            // Track wrong answers
            wrongAnswers.push({
                question: selectedQuestions[index].question,
                userAnswer: selectedQuestions[index].options[answer],
                correctAnswer: selectedQuestions[index].options[selectedQuestions[index].correctAnswer]
            });
        }
        
        feedback += `Question ${index + 1}: ${answer === selectedQuestions[index].correctAnswer ? 'Correct' : 'Incorrect'}<br>`;
        feedback += `Correct Answer: ${selectedQuestions[index].options[selectedQuestions[index].correctAnswer]}<br><br>`;
    });

    // Save quiz results
    const quizResults = {
        score: score,
        totalQuestions: numberOfQuestions,
        wrongQuestions: wrongAnswers,
        topics: Array.from(document.querySelectorAll('input[name="topics"]:checked')).map(el => el.value)
    };
    
    saveUserProgress(quizResults);

    // Display results
    document.getElementById('results').innerHTML = `
        Score: ${score}/${numberOfQuestions}<br>
        ${feedback}
    `;
}

if (loginButton) {
    loginButton.addEventListener('click', signInWithGoogle);
}