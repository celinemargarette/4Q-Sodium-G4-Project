const gameData = {
    easy: [
        {
            images: ["images/sun1.jpg", "images/sun2.jpg", "images/sun3.jpg", "images/sun4.jpg"],
            answer: "SUN",
            hint: "Shines bright in the sky"
        },
        {
            images: ["images/cute1.jpg", "images/cute2.jpg", "images/cute3.jpg", "images/cute4.jpg"],
            answer: "CUTE",
            hint: "adorable, me, celine"
        },
        {
            images: ["images/apple1.jpg", "images/apple2.jpg", "images/apple3.jpg", "images/apple4.jpg"],
            answer: "APPLE",
            hint: "crim student: ate pa print ate: a4? crim student: apple"
        },
        {
            images: ["images/yogurt1.jpg", "images/yogurt2.jpg", "images/yogurt3.jpg", "images/yogurt4.jpg"],
            answer: "YOGURT",
            hint: "Healthy dairy product"
        },
        {
            images: ["images/tree1.jpg", "images/tree2.jpg", "images/tree3.jpg", "images/tree4.jpg"],
            answer: "TREE",
            hint: "Grows in the forest"
        }
    ],
    hard: [
        {
            images: ["images/corrupt1.jpg", "images/corrupt2.jpg", "images/corrupt3.jpg", "images/corrupt4.jpg"],
            answer: "CORRUPT",
            hint: "government"
        },
        {
            images: ["images/pisay1.jpg", "images/pisay2.jpg", "images/pisay3.jpg", "images/pisay4.jpg"],
            answer: "PISAY",
            hint: "Philippine Science High School"
        },
        {
            images: ["images/hacker1.jpg", "images/hacker2.jpg", "images/hacker3.jpg", "images/hacker4.jpg"],
            answer: "HACKER",
            hint: "Computer security expert"
        },
        {
            images: ["images/jovani1.jpg", "images/jovani2.jpg", "images/jovani3.jpg", "images/jovani4.jpg"],
            answer: "JOVANI",
            hint: "A name that starts with J"
        },
        {
            images: ["images/kyleenorio1.jpg", "images/kyleenorio2.jpg", "images/kyleenorio3.jpg", "images/kyleenorio4.jpg"],
            answer: "KYLEENORIO",
            hint: "A unique last name"
        }
    ]
};

document.addEventListener('DOMContentLoaded', function () {
    const landingPage = document.getElementById('landing-page');
    const usernameContainer = document.getElementById('username-container');
    const difficultyContainer = document.getElementById('difficulty-container');
    const gameContainer = document.getElementById('game-container');
    const resultsContainer = document.getElementById('results-container');
    const playBtn = document.getElementById('play-btn');
    const usernameForm = document.getElementById('username-form');
    const usernameInput = document.getElementById('username-input');
    const easyBtn = document.getElementById('easy-btn');
    const hardBtn = document.getElementById('hard-btn');
    const welcomeMessage = document.getElementById('welcome-message');
    const picsContainer = document.getElementById('pics-container');
    const letterBoxes = document.getElementById('letter-boxes');
    const answerInput = document.getElementById('answer-input');
    const submitAnswerBtn = document.getElementById('submit-answer');
    const hintBtn = document.getElementById('hint-btn');
    const currentLevelEl = document.getElementById('current-level');
    const currentScoreEl = document.getElementById('current-score');
    const progressBar = document.getElementById('progress-bar');
    const resultScore = document.getElementById('result-score');
    const resultStars = document.getElementById('result-stars');
    const playAgainBtn = document.getElementById('play-again-btn');
    const timerEl = document.getElementById('timer');

    let currentLevel = 1;
    let currentRound = {};
    let score = 0;
    let username = '';
    let timer = null;
    let timeLeft = 30;
    let currentDifficulty = 'easy';

    function init() {
        const savedName = localStorage.getItem('fourPicOneWordUsername');
        if (savedName) {
            username = savedName;
        }

        landingPage.style.display = 'block';
        usernameContainer.style.display = 'none';
        difficultyContainer.style.display = 'none';
        gameContainer.style.display = 'none';
        resultsContainer.style.display = 'none';

        playBtn.onclick = () => {
            landingPage.style.display = 'none';
            usernameContainer.style.display = 'block';
            usernameInput.focus();
        };

        usernameForm.onsubmit = (e) => {
            e.preventDefault();
            const val = usernameInput.value.trim();
            if (/^[a-zA-Z0-9]+$/.test(val)) {
                username = val;
                localStorage.setItem('fourPicOneWordUsername', username);
                showDifficultySelection();
            } else {
                alert("Username should only contain letters and numbers!");
            }
        };

        easyBtn.onclick = () => {
            currentDifficulty = 'easy';
            startGame();
        };

        hardBtn.onclick = () => {
            currentDifficulty = 'hard';
            startGame();
        };

        submitAnswerBtn.onclick = checkAnswer;

        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });

        hintBtn.onclick = () => {
            alert(currentRound.hint);
        };

        playAgainBtn.onclick = () => {
            resultsContainer.style.display = 'none';
            showDifficultySelection();
        };
    }

    function showDifficultySelection() {
        usernameContainer.style.display = 'none';
        difficultyContainer.style.display = 'block';
    }

    function startGame() {
        currentLevel = 1;
        score = 0;
        difficultyContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        welcomeMessage.textContent = `Welcome, ${username}! (${currentDifficulty.toUpperCase()})`;
        loadRound();
    }

    function loadRound() {
        const round = gameData[currentDifficulty][currentLevel - 1];
        currentRound = round;

        answerInput.value = '';
        letterBoxes.innerHTML = '';

        round.images.forEach((src, i) => {
            const box = document.getElementById(`pic-box-${i + 1}`);
            box.style.backgroundImage = `url(${src})`;
        });

        for (let i = 0; i < round.answer.length; i++) {
            const letter = document.createElement('span');
            letter.classList.add('letter-box');
            letter.textContent = '_';
            letterBoxes.appendChild(letter);
        }

        currentLevelEl.textContent = currentLevel;
        currentScoreEl.textContent = score;
        progressBar.style.width = ((currentLevel - 1) / 5) * 100 + "%";

        startTimer();
    }

    function startTimer() {
        clearInterval(timer);
        timeLeft = 30;
        updateTimer();

        timer = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Time's up!");
                endGame();
            }
        }, 1000);
    }

    function updateTimer() {
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        timerEl.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function checkAnswer() {
        const userInput = answerInput.value.trim().toUpperCase();
        if (userInput === currentRound.answer.toUpperCase()) {
            score++;
            if (currentLevel < 5) {
                currentLevel++;
                loadRound();
            } else {
                endGame();
            }
        } else {
            alert("Mali! Try ulit.");
        }
    }

    function endGame() {
        clearInterval(timer);
        gameContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        resultScore.textContent = `${score}/5`;
        resultStars.textContent = "★".repeat(score >= 4 ? 3 : score >= 2 ? 2 : 1);
    }

    init();
});
