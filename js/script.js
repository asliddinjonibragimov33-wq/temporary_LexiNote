// =========================
// ELEMENTLARNI OLISH
// =========================

const bookSelect = document.getElementById("bookSelect");
const topicSelect = document.getElementById("topicSelect");
const startBtn = document.getElementById("startBtn");

const quizSection = document.getElementById("quizSection");
const selectionCard = document.querySelector(".selection-card");
const intro = document.querySelector(".intro");

const resultSection = document.getElementById("resultSection");

const questionNumber = document.getElementById("questionNumber");
const quizScore = document.getElementById("quizScore");
const score = document.getElementById("score");

const koreanWord = document.getElementById("koreanWord");
const wordLabel = document.querySelector(".word-label");

const answerInput = document.getElementById("answerInput");
const answerLabel = document.querySelector(".answer-area label");

const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");

const result = document.getElementById("result");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const directionInputs = document.querySelectorAll(
    'input[name="direction"]'
);


// =========================
// QUIZ O'ZGARUVCHILARI
// =========================

let currentWords = [];
let quizWords = [];

let currentIndex = 0;
let currentWord = null;
let currentScore = 0;

let direction = "ko-uz";

const QUIZ_LENGTH = 10;


// =========================
// KITOB TANLASH
// =========================

bookSelect.addEventListener("change", function () {

    const selectedBook = bookSelect.value;

    topicSelect.innerHTML = "";

    if (!selectedBook) {

        topicSelect.disabled = true;
        startBtn.disabled = true;

        topicSelect.innerHTML =
            '<option value="">Avval kitobni tanlang</option>';

        return;
    }

    // Tanlangan kitobdagi mavzular
    const topics = Object.keys(dictionaries[selectedBook]);

    topicSelect.disabled = false;
    startBtn.disabled = true;

    topicSelect.innerHTML =
        '<option value="">Mavzuni tanlang</option>';

    topics.forEach(function (topic) {

        const option = document.createElement("option");

        option.value = topic;
        option.textContent = topic;

        topicSelect.appendChild(option);
    });
});


// =========================
// MAVZU TANLASH
// =========================

topicSelect.addEventListener("change", function () {

    if (topicSelect.value) {
        startBtn.disabled = false;
    } else {
        startBtn.disabled = true;
    }
});


// =========================
// YO'NALISHNI ALMASHTIRISH
// =========================

directionInputs.forEach(function (input) {

    input.addEventListener("change", function () {

        direction = input.value;

        updateDirectionText();
    });
});


// =========================
// YO'NALISH MATNLARINI O'ZGARTIRISH
// =========================

function updateDirectionText() {

    if (direction === "ko-uz") {

        wordLabel.textContent = "Koreyscha so‘z";

        answerLabel.textContent =
            "O‘zbekcha tarjimasini yozing";

        answerInput.placeholder =
            "Tarjimani kiriting...";

    } else {

        wordLabel.textContent = "O‘zbekcha so‘z";

        answerLabel.textContent =
            "Koreyscha so‘zini yozing";

        answerInput.placeholder =
            "Koreyscha so‘zni kiriting...";
    }
}


// =========================
// QUIZNI BOSHLASH
// =========================

startBtn.addEventListener("click", function () {

    const selectedBook = bookSelect.value;
    const selectedTopic = topicSelect.value;

    // Tanlangan mavzudagi lug'atlar
    currentWords =
        dictionaries[selectedBook][selectedTopic];

    // Lug'atlarni aralashtiramiz
    quizWords = shuffleArray([...currentWords]);

    // Agar 10 tadan kam bo'lsa,
    // mavjud so'zlarning hammasini olamiz
    quizWords = quizWords.slice(
        0,
        Math.min(QUIZ_LENGTH, quizWords.length)
    );

    currentIndex = 0;
    currentScore = 0;

    score.textContent = "Ball: 0";
    quizScore.textContent = "Ball: 0";

    selectionCard.classList.add("hidden");
    intro.classList.add("hidden");

    resultSection.classList.add("hidden");
    quizSection.classList.remove("hidden");

    showQuestion();
});


// =========================
// SAVOLNI KO'RSATISH
// =========================

function showQuestion() {

    currentWord = quizWords[currentIndex];

    let question;

    if (direction === "ko-uz") {

        question = currentWord.korean;

    } else {

        question = currentWord.uzbek;
    }

    koreanWord.textContent = question;

    questionNumber.textContent =
        `${currentIndex + 1} / ${quizWords.length}`;

    answerInput.value = "";

    answerInput.disabled = false;
    checkBtn.disabled = false;

    nextBtn.classList.add("hidden");

    result.textContent = "";

    answerInput.focus();
}


// =========================
// JAVOBNI TEKSHIRISH
// =========================

checkBtn.addEventListener("click", checkAnswer);


// Enter BOSILGANDA HAM TEKSHIRISH
answerInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        if (!checkBtn.disabled) {
            checkAnswer();
        }
    }
});


// =========================
// JAVOBNI TEKSHIRISH FUNKSIYASI
// =========================

function checkAnswer() {

    const userAnswer =
        normalizeText(answerInput.value);

    let correctAnswer;

    if (direction === "ko-uz") {

        correctAnswer =
            normalizeText(currentWord.uzbek);

    } else {

        correctAnswer =
            normalizeText(currentWord.korean);
    }


    if (userAnswer === correctAnswer) {

        // TO'G'RI
        currentScore++;

        result.textContent = "✅ To‘g‘ri!";

        result.className = "result correct";

    } else {

        // NOTO'G'RI
        result.textContent =
            `❌ Noto‘g‘ri. To‘g‘ri javob: ${getCorrectAnswer()}`;

        result.className = "result wrong";
    }


    score.textContent =
        `Ball: ${currentScore}`;

    quizScore.textContent =
        `Ball: ${currentScore}`;


    answerInput.disabled = true;
    checkBtn.disabled = true;

    nextBtn.classList.remove("hidden");
}


// =========================
// TO'G'RI JAVOBNI OLISH
// =========================

function getCorrectAnswer() {

    if (direction === "ko-uz") {

        return currentWord.uzbek;

    } else {

        return currentWord.korean;
    }
}


// =========================
// KEYINGI SAVOL
// =========================

nextBtn.addEventListener("click", function () {

    currentIndex++;

    if (currentIndex < quizWords.length) {

        showQuestion();

    } else {

        finishQuiz();
    }
});


// =========================
// QUIZNI YAKUNLASH
// =========================

function finishQuiz() {

    quizSection.classList.add("hidden");

    resultSection.classList.remove("hidden");

    finalScore.textContent =
        `Natija: ${currentScore} / ${quizWords.length}`;
}


// =========================
// QAYTADAN BOSHLASH
// =========================

restartBtn.addEventListener("click", function () {

    resultSection.classList.add("hidden");

    selectionCard.classList.remove("hidden");
    intro.classList.remove("hidden");

    currentIndex = 0;
    currentScore = 0;

    score.textContent = "Ball: 0";
    quizScore.textContent = "Ball: 0";
});


// =========================
// MATNNI NORMALIZATSIYA QILISH
// =========================

function normalizeText(text) {

    return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}


// =========================
// TASODIFIY ARALASHTIRISH
// =========================

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
            [array[j], array[i]];
    }

    return array;
}


// =========================
// BOSHLANG'ICH HOLAT
// =========================

updateDirectionText();
