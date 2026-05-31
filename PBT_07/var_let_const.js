// ============================================================
// var_let_const.js — Kiểm chứng Câu A1
// Chạy: node var_let_const.js
// ============================================================

console.log("===== ĐOẠN 1: var hoisting =====");
// var bị hoisted → khai báo lên đầu, giá trị chưa gán → undefined
console.log(x);      // → undefined (không phải lỗi!)
var x = 5;
console.log(x);      // → 5

console.log("\n===== ĐOẠN 2: let + TDZ =====");
// let cũng hoisted nhưng nằm trong Temporal Dead Zone → ReferenceError
try {
    console.log(y);  // → ReferenceError
    let y = 10;
} catch (err) {
    console.log("Lỗi:", err.message);
}
let y = 10;
console.log(y);      // → 10

console.log("\n===== ĐOẠN 3: const không gán lại được =====");
const z = 15;
try {
    z = 20;          // → TypeError
} catch (err) {
    console.log("Lỗi:", err.message);
}
console.log(z);      // → 15 (vẫn giữ giá trị cũ)

console.log("\n===== ĐOẠN 4: const với array/object =====");
// const không cho gán lại BIẾN, nhưng cho phép thay đổi NỘI DUNG
const arr = [1, 2, 3];
arr.push(4);         // ✅ OK — thêm phần tử vào mảng
console.log(arr);    // → [1, 2, 3, 4]
try {
    arr = [5, 6];    // ❌ Lỗi — gán lại biến arr
} catch (err) {
    console.log("Lỗi khi gán lại:", err.message);
}

console.log("\n===== ĐOẠN 5: let + block scope =====");
let a = 1;
{
    let a = 2;                        // a mới trong block này
    console.log("Trong block:", a);   // → 2
}
console.log("Ngoài block:", a);       // → 1 (a bên ngoài không bị ảnh hưởng)

console.log("\n===== TỔNG KẾT =====");
console.log("var  → function-scope, hoisted (undefined), có thể gán lại");
console.log("let  → block-scope, TDZ, có thể gán lại");
console.log("const → block-scope, TDZ, KHÔNG gán lại (nhưng object/array vẫn mutable)");
