// ============================================================
// calculator.js — Bài B1: Máy tính đơn giản
// Chạy: node calculator.js
// ============================================================

function calculate(num1, operator, num2) {
    // Kiểm tra input có phải số không
    if (isNaN(num1) || isNaN(num2)) {
        return "Lỗi: Input không phải số";
    }

    // Chuyển sang number (phòng trường hợp truyền string số)
    const a = Number(num1);
    const b = Number(num2);

    // Xử lý từng operator
    switch (operator) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            if (b === 0) return "Lỗi: Không thể chia cho 0";
            return a / b;
        case "%":
            if (b === 0) return "Lỗi: Không thể chia cho 0";
            return a % b;
        case "**":
            return a ** b;
        default:
            return `Lỗi: Operator '${operator}' không hợp lệ`;
    }
}

// ============================================================
// Test cases
// ============================================================
console.log("===== TEST CALCULATOR =====\n");

console.log("calculate(10, '+', 5)   →", calculate(10, "+", 5));      // 15
console.log("calculate(10, '-', 3)   →", calculate(10, "-", 3));      // 7
console.log("calculate(10, '*', 4)   →", calculate(10, "*", 4));      // 40
console.log("calculate(10, '/', 4)   →", calculate(10, "/", 4));      // 2.5
console.log("calculate(10, '%', 3)   →", calculate(10, "%", 3));      // 1
console.log("calculate(2, '**', 10)  →", calculate(2, "**", 10));     // 1024

console.log("\n--- Edge cases ---");
console.log("calculate(10, '/', 0)   →", calculate(10, "/", 0));      // Lỗi chia 0
console.log("calculate(10, '^', 5)   →", calculate(10, "^", 5));      // Lỗi operator
console.log("calculate('abc', '+', 5)→", calculate("abc", "+", 5));   // Lỗi input
console.log("calculate(10, '+', 'xy')→", calculate(10, "+", "xy"));   // Lỗi input
console.log("calculate('5', '+', '3')→", calculate("5", "+", "3"));   // 8 (string số → OK)
