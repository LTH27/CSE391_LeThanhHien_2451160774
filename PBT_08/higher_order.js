// ============================================================
// higher_order.js — Bài B3: Higher-Order Functions
// Chạy: node higher_order.js
// ============================================================

// ============================================================
// 1. pipe() — Nối chuỗi functions: kết quả hàm trước → input hàm sau
// ============================================================
function pipe(...fns) {
    return function(initialValue) {
        return fns.reduce((value, fn) => fn(value), initialValue);
    };
}

console.log("===== 1. PIPE =====");
const process = pipe(
    x => x * 2,
    x => x + 10,
    x => x.toString(),
    x => "Kết quả: " + x
);
console.log(process(5));   // → "Kết quả: 20"
console.log(process(10));  // → "Kết quả: 30"

// ============================================================
// 2. memoize() — Cache kết quả, tránh tính lại khi cùng input
// ============================================================
function memoize(fn) {
    const cache = {};  // Lưu: "input" → result

    return function(...args) {
        const key = JSON.stringify(args);  // Chuyển args thành string làm key
        if (key in cache) {
            console.log(`  [cache hit] key=${key}`);
            return cache[key];
        }
        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}

console.log("\n===== 2. MEMOIZE =====");
const expensiveCalc = memoize((n) => {
    console.log("  Đang tính...");
    let result = 0;
    for (let i = 0; i < n; i++) result += i;
    return result;
});

console.log(expensiveCalc(1000000));  // In "Đang tính..." → tính lần đầu
console.log(expensiveCalc(1000000));  // [cache hit] → không tính lại
console.log(expensiveCalc(500));      // Input mới → tính lại
console.log(expensiveCalc(500));      // [cache hit]

// ============================================================
// 3. debounce() — Chỉ gọi fn sau khi ngừng gọi delay ms
// ============================================================
function debounce(fn, delay) {
    let timer = null;

    return function(...args) {
        // Hủy timer cũ nếu có
        clearTimeout(timer);
        // Đặt timer mới
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

console.log("\n===== 3. DEBOUNCE =====");
const search = debounce((query) => {
    console.log("  Searching:", query);
}, 300);

// Giả lập gõ liên tục — chỉ lần cuối mới thực sự search
search("i");
search("ip");
search("iph");
search("ipho");
search("iphon");
search("iphone");  // ← Chỉ cái này chạy sau 300ms

// Dùng timeout để in kết quả sau 400ms
setTimeout(() => {
    console.log("  (Sau 400ms — debounce đã kích hoạt)");
}, 400);

// ============================================================
// 4. retry() — Thử lại tối đa maxAttempts lần nếu bị lỗi
// ============================================================
async function retry(fn, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await fn();
            console.log(`  ✅ Thành công ở lần ${attempt}`);
            return result;
        } catch (err) {
            console.log(`  ❌ Lần ${attempt} thất bại: ${err.message}`);
            if (attempt === maxAttempts) {
                throw new Error(`Đã thử ${maxAttempts} lần, vẫn thất bại.`);
            }
            // Chờ trước khi thử lại (exponential backoff đơn giản)
            await new Promise(r => setTimeout(r, 100 * attempt));
        }
    }
}

console.log("\n===== 4. RETRY =====");

// Test: hàm lỗi 2 lần đầu, thành công lần 3
let callCount = 0;
const flakeyApi = () => new Promise((resolve, reject) => {
    callCount++;
    if (callCount < 3) {
        reject(new Error(`Network error (attempt ${callCount})`));
    } else {
        resolve("Dữ liệu từ API");
    }
});

retry(flakeyApi, 3)
    .then(data => console.log("  Kết quả:", data))
    .catch(err => console.log("  Lỗi cuối:", err.message));

// Test: luôn thất bại
const alwaysFail = () => Promise.reject(new Error("Timeout"));
retry(alwaysFail, 3)
    .then(data => console.log("  Kết quả:", data))
    .catch(err => console.log("  Lỗi cuối:", err.message));
