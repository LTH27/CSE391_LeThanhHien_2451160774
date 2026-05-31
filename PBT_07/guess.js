// ============================================================
// guess.js — Logic game đoán số
// ============================================================

const MAX_ATTEMPTS = 7;
let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let guessedNumbers = [];
let gameOver = false;

function startGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    guessedNumbers = [];
    gameOver = false;
    updateDisplay();
    document.getElementById("guess-input").disabled = false;
    document.getElementById("submit-btn").disabled = false;
    document.getElementById("message").textContent = "Bắt đầu đoán nào! Nhập số từ 1 đến 100.";
    document.getElementById("message").className = "message info";
    document.getElementById("history").textContent = "";
    document.getElementById("attempts-left").textContent = MAX_ATTEMPTS;
}

function updateDisplay() {
    document.getElementById("attempts-left").textContent = MAX_ATTEMPTS - attempts;
}

function handleGuess() {
    if (gameOver) return;

    const input = document.getElementById("guess-input");
    const rawValue = input.value.trim();
    const guess = Number(rawValue);
    const msgEl = document.getElementById("message");
    const historyEl = document.getElementById("history");

    // Validate: phải là số nguyên từ 1-100
    if (rawValue === "" || isNaN(guess) || !Number.isInteger(guess) || guess < 1 || guess > 100) {
        msgEl.textContent = "⚠️ Vui lòng nhập số nguyên từ 1 đến 100!";
        msgEl.className = "message warn";
        input.value = "";
        return;
    }

    // Kiểm tra đoán trùng
    if (guessedNumbers.includes(guess)) {
        msgEl.textContent = `⚠️ Bạn đã đoán số ${guess} rồi! Thử số khác đi.`;
        msgEl.className = "message warn";
        input.value = "";
        return;
    }

    guessedNumbers.push(guess);
    attempts++;
    updateDisplay();
    input.value = "";

    // Thêm vào lịch sử
    const historyItem = document.createElement("span");
    historyItem.textContent = guess;

    if (guess === secretNumber) {
        // Đoán đúng!
        historyItem.className = "history-correct";
        historyEl.appendChild(historyItem);
        msgEl.textContent = `🎉 Chính xác! Bạn đoán đúng sau ${attempts} lần!`;
        msgEl.className = "message success";
        endGame(true);
    } else if (attempts >= MAX_ATTEMPTS) {
        // Hết lượt
        historyItem.className = "history-wrong";
        historyEl.appendChild(historyItem);
        msgEl.textContent = `😢 Hết lượt! Đáp án là ${secretNumber}. Chơi lại nhé!`;
        msgEl.className = "message error";
        endGame(false);
    } else if (guess < secretNumber) {
        historyItem.className = "history-low";
        historyEl.appendChild(historyItem);
        msgEl.textContent = `📈 Cao hơn! Còn ${MAX_ATTEMPTS - attempts} lượt.`;
        msgEl.className = "message hint";
    } else {
        historyItem.className = "history-high";
        historyEl.appendChild(historyItem);
        msgEl.textContent = `📉 Thấp hơn! Còn ${MAX_ATTEMPTS - attempts} lượt.`;
        msgEl.className = "message hint";
    }

    // Thêm khoảng cách giữa các lần đoán
    historyEl.appendChild(document.createTextNode(" "));
}

function endGame(won) {
    gameOver = true;
    document.getElementById("guess-input").disabled = true;
    document.getElementById("submit-btn").disabled = true;
}

// Cho phép nhấn Enter để đoán
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("guess-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleGuess();
    });
    startGame();
});
