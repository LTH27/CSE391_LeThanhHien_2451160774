// ============================================================
// student_data.js — Bài B2: Xử lý dữ liệu sinh viên
// Chạy: node student_data.js
// ============================================================

const students = [
    { name: "An",    math: 8,  physics: 7, cs: 9, gender: "M" },
    { name: "Bình",  math: 6,  physics: 9, cs: 7, gender: "F" },
    { name: "Chi",   math: 9,  physics: 6, cs: 8, gender: "F" },
    { name: "Dũng",  math: 5,  physics: 5, cs: 6, gender: "M" },
    { name: "Em",    math: 10, physics: 8, cs: 9, gender: "F" },
    { name: "Phong", math: 3,  physics: 4, cs: 5, gender: "M" },
    { name: "Giang", math: 7,  physics: 7, cs: 7, gender: "F" },
    { name: "Huy",   math: 4,  physics: 6, cs: 3, gender: "M" },
];

// ============================================================
// 1. Tính điểm TB và xếp loại cho mỗi sinh viên
// ============================================================
function tinhTB(sv) {
    return sv.math * 0.4 + sv.physics * 0.3 + sv.cs * 0.3;
}

function xepLoai(tb) {
    if (tb >= 8.0) return "Giỏi";
    if (tb >= 6.5) return "Khá";
    if (tb >= 5.0) return "Trung bình";
    return "Yếu";
}

// Thêm TB và xếp loại vào từng sinh viên
const ketQua = students.map(sv => ({
    ...sv,
    tb: Math.round(tinhTB(sv) * 10) / 10,  // làm tròn 1 chữ số
    xepLoai: xepLoai(tinhTB(sv))
}));

// ============================================================
// 2. In bảng kết quả
// ============================================================
console.log("===== KẾT QUẢ HỌC TẬP =====\n");
console.log("| STT | Tên    | TB   | Xếp loại    |");
console.log("|-----|--------|------|-------------|");

ketQua.forEach((sv, i) => {
    const stt = String(i + 1).padEnd(3);
    const name = sv.name.padEnd(6);
    const tb = String(sv.tb).padEnd(4);
    const xl = sv.xepLoai.padEnd(11);
    console.log(`| ${stt} | ${name} | ${tb} | ${xl} |`);
});

// ============================================================
// 3. Đếm số SV mỗi xếp loại
// ============================================================
console.log("\n===== THỐNG KÊ XẾP LOẠI =====");
const loai = { "Giỏi": 0, "Khá": 0, "Trung bình": 0, "Yếu": 0 };
for (const sv of ketQua) {
    loai[sv.xepLoai]++;
}
for (const [key, val] of Object.entries(loai)) {
    console.log(`  ${key}: ${val} sinh viên`);
}

// ============================================================
// 4. SV điểm cao nhất và thấp nhất
// ============================================================
let svCaoNhat = ketQua[0];
let svThapNhat = ketQua[0];

for (const sv of ketQua) {
    if (sv.tb > svCaoNhat.tb) svCaoNhat = sv;
    if (sv.tb < svThapNhat.tb) svThapNhat = sv;
}

console.log("\n===== ĐIỂM CAO NHẤT / THẤP NHẤT =====");
console.log(`  Cao nhất: ${svCaoNhat.name} (${svCaoNhat.tb})`);
console.log(`  Thấp nhất: ${svThapNhat.name} (${svThapNhat.tb})`);

// ============================================================
// 5. Điểm TB toàn lớp từng môn
// ============================================================
let tongMath = 0, tongPhysics = 0, tongCS = 0;
for (const sv of students) {
    tongMath += sv.math;
    tongPhysics += sv.physics;
    tongCS += sv.cs;
}
const n = students.length;

console.log("\n===== ĐIỂM TRUNG BÌNH TỪNG MÔN =====");
console.log(`  Toán:  ${(tongMath / n).toFixed(2)}`);
console.log(`  Lý:    ${(tongPhysics / n).toFixed(2)}`);
console.log(`  CNTT:  ${(tongCS / n).toFixed(2)}`);

// ============================================================
// BONUS: Điểm TB theo giới tính
// ============================================================
let namTong = 0, namCount = 0;
let nuTong = 0, nuCount = 0;

for (const sv of ketQua) {
    if (sv.gender === "M") {
        namTong += sv.tb;
        namCount++;
    } else {
        nuTong += sv.tb;
        nuCount++;
    }
}

console.log("\n===== ĐIỂM TB THEO GIỚI TÍNH =====");
console.log(`  Nam: ${(namTong / namCount).toFixed(2)} (${namCount} SV)`);
console.log(`  Nữ:  ${(nuTong / nuCount).toFixed(2)} (${nuCount} SV)`);
