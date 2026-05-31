// ============================================================
// fizzbuzz.js — Bài B4: FizzBuzz cơ bản + nâng cao
// Chạy: node fizzbuzz.js
// ============================================================

// ============================================================
// Version 1: FizzBuzz cổ điển
// ============================================================
console.log("===== VERSION 1: CLASSIC FIZZBUZZ (1-20) =====\n");

for (let i = 1; i <= 20; i++) {
    if (i % 15 === 0) {
        console.log(`${i}: FizzBuzz`);
    } else if (i % 3 === 0) {
        console.log(`${i}: Fizz`);
    } else if (i % 5 === 0) {
        console.log(`${i}: Buzz`);
    } else {
        console.log(`${i}: ${i}`);
    }
}

// ============================================================
// Version 2: Custom FizzBuzz với bộ rules bất kỳ
// ============================================================
function customFizzBuzz(n, rules) {
    const results = [];

    for (let i = 1; i <= n; i++) {
        let output = "";

        // Duyệt qua tất cả rules, ghép chữ nếu chia hết
        for (const rule of rules) {
            if (i % rule.divisor === 0) {
                output += rule.word;
            }
        }

        // Nếu không khớp rule nào → in số
        if (output === "") output = String(i);

        results.push(`${i}: ${output}`);
    }

    return results;
}

console.log("\n===== VERSION 2: CUSTOM (Fizz=3, Buzz=5, Jazz=7) — 1 đến 30 =====\n");

const rules = [
    { divisor: 3, word: "Fizz" },
    { divisor: 5, word: "Buzz" },
    { divisor: 7, word: "Jazz" }
];

const output = customFizzBuzz(30, rules);
output.forEach(line => console.log(line));

// Kiểm tra các trường hợp đặc biệt
console.log("\n--- Kiểm tra kết quả đặc biệt ---");
const specialCases = customFizzBuzz(105, rules);
console.log(specialCases[20]);   // 21 = FizzJazz (3×7)
console.log(specialCases[14]);   // 15 = FizzBuzz (3×5)
console.log(specialCases[34]);   // 35 = BuzzJazz (5×7)
console.log(specialCases[104]);  // 105 = FizzBuzzJazz (3×5×7)
