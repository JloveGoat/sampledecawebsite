// Add this at the top of both files
// Add network status monitoring
window.addEventListener('online', function() {
    console.log('Network connection restored');
});

window.addEventListener('offline', function() {
    console.log('Network connection lost');
});

// Check initial network status
console.log('Initial network status:', navigator.onLine ? 'online' : 'offline');

document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("User is logged in:", user.email);
            const userInfo = document.getElementById('user-info');
            const userEmail = document.getElementById('user-email');
            const userPhoto = document.getElementById('user-photo');
            
            if (userInfo && userEmail && userPhoto) {
                userInfo.style.display = 'flex';
                userEmail.textContent = user.email;
                userPhoto.src = user.photoURL;
            }
        }
    });
});

// Array of questions
const questionGroups = {
    businessLaw: {
        multipleChoice: [
            {
                question: "What is the primary purpose of business law?",
                options: [
                    "To regulate business practices",
                    "To promote competition",
                    "To protect consumers",
                    "All of the above"
                ],
                correctAnswer: 3
            },
            // Add more questions here
        ]
    },
    communications: {
        multipleChoice: [
            {
                question: "What is the most effective form of communication in a business setting?",
                options: [
                    "Email",
                    "Face-to-face",
                    "Phone calls",
                    "Text messages"
                ],
                correctAnswer: 1
            },
            // Add more questions here
        ]
    },
    customerRelations: {
        multipleChoice: [
            {
                question: "What is a key factor in maintaining good customer relations?",
                options: [
                    "High prices",
                    "Poor service",
                    "Effective communication",
                    "Limited availability"
                ],
                correctAnswer: 2
            },
            // Add more questions here
        ]
    },
    economics: {
        multipleChoice: [
            {
                question: "What is the law of supply and demand?",
                options: [
                    "Prices increase when supply exceeds demand",
                    "Prices decrease when demand exceeds supply",
                    "Prices are determined by the government",
                    "None of the above"
                ],
                correctAnswer: 1
            },
            // Add more questions here
        ]
    },
    emotionalIntelligence: {
        multipleChoice: [
            {
                question: "What is emotional intelligence?",
                options: [
                    "The ability to understand and manage your own emotions",
                    "The ability to manipulate others' emotions",
                    "The ability to ignore emotions",
                    "The ability to memorize emotional responses"
                ],
                correctAnswer: 0
            },
            // Add more questions here
        ]
    },
    entrepreneurship: {
        multipleChoice: [
            {
                question: "What is a key characteristic of successful entrepreneurs?",
                options: [
                    "Risk aversion",
                    "Creativity",
                    "Lack of planning",
                    "Indecisiveness"
                ],
                correctAnswer: 1
            },
            // Add more questions here
        ]
    },
    financialAnalysis: {
        multipleChoice: [
            {
                question: "What is the primary purpose of financial analysis?",
                options: [
                    "To assess the profitability of a business",
                    "To determine employee satisfaction",
                    "To evaluate marketing strategies",
                    "To analyze customer feedback"
                ],
                correctAnswer: 0
            },
            // Add more questions here
        ]
    },
    humanResourceManagement: {
        multipleChoice: [
            {
                question: "What is the main goal of human resource management?",
                options: [
                    "To maximize employee productivity",
                    "To minimize costs",
                    "To ensure compliance with laws",
                    "To manage company finances"
                ],
                correctAnswer: 0
            },
            // Add more questions here
        ]
    },
    informationManagement: {
        multipleChoice: [
            {
                question: "What is the primary focus of information management?",
                options: [
                    "Data storage",
                    "Data analysis",
                    "Data security",
                    "All of the above"
                ],
                correctAnswer: 3
            },
            // Add more questions here
        ]
    },
    knowledgeManagement: {
        multipleChoice: [
            {
                question: "What is knowledge management?",
                options: [
                    "The process of creating, sharing, using, and managing knowledge",
                    "The process of storing data",
                    "The process of hiring employees",
                    "The process of marketing products"
                ],
                correctAnswer: 0
            },
            // Add more questions here
        ]
    },
    marketing: {
        multipleChoice: [
            {
                question: "What is the primary goal of marketing?",
                options: [
                    "To sell products",
                    "To create brand awareness",
                    "To conduct market research",
                    "To manage customer relations"
                ],
                correctAnswer: 1
            },
            // Add more questions here
        ]
    },
    operations: {
        multipleChoice: [
            {
                question: "What is the main focus of operations management?",
                options: [
                    "Managing the production of goods and services",
                    "Managing employee relations",
                    "Managing financial resources",
                    "Managing marketing strategies"
                ],
                correctAnswer: 0
            },
            // Add more questions here
        ]
    },
    professionalDevelopment: {
        multipleChoice: [
            {
                question: "What is a key component of professional development?",
                options: [
                    "Networking",
                    "Ignoring feedback",
                    "Avoiding new skills",
                    "Staying in the same position"
                ],
                correctAnswer: 0
            },
            // Add more questions here
        ]
    },
    projectManagement: {
        multipleChoice: [
            {
                question: "What is the primary goal of project management?",
                options: [
                    "To complete projects on time and within budget",
                    "To increase employee satisfaction",
                    "To reduce costs",
                    "To improve marketing strategies"
                ],
                correctAnswer: 0
            },
            // Add more questions here
        ]
    },
    qualityManagement: {
        multipleChoice: [
            {
                question: "What is the focus of quality management?",
                options: [
                    "Ensuring products meet customer expectations",
                    "Reducing production costs",
                    "Increasing employee productivity",
                    "Improving marketing strategies"
                ],
                correctAnswer: 0
            },
            // Add more questions here
        ]
    },
    riskManagement: {
        multipleChoice: [
            {
                question: "What is the purpose of risk management?",
                options: [
                    "To identify and mitigate potential risks",
                    "To increase profits",
                    "To improve employee morale",
                    "To enhance marketing strategies"
                ],
                correctAnswer: 0
            },
            // Add more questions here
        ]
    },
    strategicManagement: {
        multipleChoice: [
            {
                question: "What is the focus of strategic management?",
                options: [
                    "Long-term planning and direction",
                    "Daily operations",
                    "Employee training",
                    "Financial analysis"
                ],
                correctAnswer: 0
            },
            // Add more questions here
        ]
    }
};

let selectedQuestions = [];
let currentAnswers = [];
let numberOfQuestions = 2; // Default value
let timer; // Timer variable
let timeLeft; // Time left in seconds
let isPaused = false; // Flag to check if the timer is paused


function selectRandomQuestions() {
    // Randomly select the specified number of questions from the array
    const shuffledQuestions = selectedQuestions.sort(() => 0.5 - Math.random());
    selectedQuestions = shuffledQuestions.slice(0, numberOfQuestions);
    currentAnswers = new Array(numberOfQuestions).fill(null); // Reset answers
}

function displayQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    selectedQuestions.forEach((q, index) => {
        const questionBox = document.createElement('div');
        questionBox.className = 'question-box';
        
        questionBox.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
            <div class="options-container">
                ${q.options.map((option, optIndex) => `
                    <button class="option-btn" 
                            onclick="selectAnswer(${index}, ${optIndex})"
                            id="q${index}-opt${optIndex}">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;
        
        container.appendChild(questionBox);
    });
}

function selectAnswer(questionIndex, optionIndex) {
    currentAnswers[questionIndex] = optionIndex;
    
    // Update visual selection
    const questionButtons = document.querySelectorAll(`[id^="q${questionIndex}-opt"]`);
    questionButtons.forEach(btn => btn.classList.remove('selected')); // Unhighlight all buttons
    document.getElementById(`q${questionIndex}-opt${optionIndex}`).classList.add('selected'); // Highlight the selected button
}

function checkAnswers() {
    console.log("checkAnswers function called");
    
    if (currentAnswers.includes(null)) {
        document.getElementById('results').innerHTML = 'Please answer all questions!';
        return;
    }

    let score = 0;
    let feedback = '';

    // Generate detailed feedback
    selectedQuestions.forEach((question, index) => {
        const userAnswer = currentAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) {
            score++;
        }

        feedback += `
            <div class="question-result ${isCorrect ? 'correct' : 'incorrect'}">
                <h4>Question ${index + 1}:</h4>
                <p>${question.question}</p>
                <div class="answer-text">
                    <p class="${isCorrect ? 'correct-answer' : 'incorrect-answer'}">
                        Your Answer: ${question.options[userAnswer]}
                        ${isCorrect ? ' ✓' : ' ✗'}
                    </p>
                    ${!isCorrect ? `
                        <p class="correct-answer">
                            Correct Answer: ${question.options[question.correctAnswer]}
                        </p>
                    ` : ''}
                </div>
            </div>
        `;
    });

    // Display results and feedback
    document.getElementById('results').innerHTML = `
        <div class="quiz-results">
            <h3>Quiz Results</h3>
            <h4>Score: ${score}/${numberOfQuestions} (${Math.round((score/numberOfQuestions) * 100)}%)</h4>
            <div class="feedback-section">
                ${feedback}
            </div>
            <div class="button-group">
                <button onclick="location.reload()" class="button">Try Another Quiz</button>
                <button onclick="window.location.href='../index.html'" class="button">Return to Home</button>
            </div>
        </div>
    `;

    // Save results
    saveQuizResult('Business Management', numberOfQuestions, score)
        .then(() => {
            console.log("Quiz results saved successfully");
        })
        .catch(error => {
            console.error("Error saving quiz results:", error);
        });
}

function redirectToHome() {
    console.log("Redirecting to home...");
    window.location.href = "../index.html"; // Adjust the path as needed
}

function resetQuiz() {
    selectRandomQuestions();
    displayQuestions();
    document.getElementById('results').innerHTML = ''; // Clear results
}

function startTimer() {
    // Clear any existing timer first
    if (timer) {
        clearInterval(timer);
    }
    
    // Reset isPaused
    isPaused = false;
    
    timer = setInterval(() => {
        if (!isPaused) {  // Only countdown if not paused
            if (timeLeft <= 0) {
                clearInterval(timer);
                document.getElementById('results').innerHTML = 'Time is up! Submitting your answers...';
                checkAnswers(); // Automatically submit answers when time is up
            } else {
                // Change color to red if 1 minute (60 seconds) is left
                if (timeLeft === 60) {
                    document.getElementById('timer-display').style.color = 'red';
                    document.getElementById('pause-btn').style.backgroundColor = 'red';
                } else if (timeLeft > 60) {
                    // Reset colors if time is above 1 minute
                    document.getElementById('timer-display').style.color = '#28a745';
                    document.getElementById('pause-btn').style.backgroundColor = '#4CAF50';
                }
                timeLeft--;
                document.getElementById('timer-display').innerText = 
                    `Time left: ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
            }
        }
    }, 1000); // Update every second
}

// Update togglePause function
function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pause-btn');
    pauseButton.innerText = isPaused ? 'Resume' : 'Pause';
}

// Update startQuiz function to ensure clean timer start
function startQuiz() {
    // Clear any existing timer
    if (timer) {
        clearInterval(timer);
    }

    const selectElement = document.getElementById('question-count');
    numberOfQuestions = parseInt(selectElement.value);

    const timerElement = document.getElementById('timer-count');
    const selectedMinutes = parseInt(timerElement.value);
    timeLeft = selectedMinutes * 60;

    // Get selected topics
    const selectedTopics = Array.from(document.querySelectorAll('input[name="topics"]:checked')).map(el => el.value);
    
    if (selectedTopics.length === 0) {
        alert("Please select at least one topic.");
        return;
    }

    // Retrieve questions based on selected topics
    selectedQuestions = [];
    selectedTopics.forEach(topic => {
        if (questionGroups[topic]) {
            const questions = questionGroups[topic].multipleChoice;
            selectedQuestions.push(...questions);
        }
    });

    // Shuffle and select questions
    selectRandomQuestions();
    displayQuestions();
    
    // Show the submit button
    document.getElementById('submit-btn').style.display = 'block';

    // Show the questions scroll area
    document.querySelector('.questions-scroll').style.display = 'block';

    // Start the timer
    startTimer();
}