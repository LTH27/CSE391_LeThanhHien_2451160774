# 📋 ĐÁP ÁN PHẦN A + C1 — PBT_07

---

## PHẦN A — KIỂM TRA ĐỌC HIỂU

---

### Câu A1 — var / let / const

**Dự đoán kết quả:**

```javascript
// Đoạn 1:
console.log(x);   // → undefined
var x = 5;
// Giải thích: var bị "hoisting" — khai báo được đưa lên đầu scope,
// nhưng GIÁ TRỊ chưa gán → undefined (không phải ReferenceError)

// Đoạn 2:
console.log(y);   // → ReferenceError: Cannot access 'y' before initialization
let y = 10;
// Giải thích: let cũng bị hoisting nhưng nằm trong "Temporal Dead Zone" (TDZ)
// Truy cập trước khai báo → ReferenceError

// Đoạn 3:
const z = 15;
z = 20;           // → TypeError: Assignment to constant variable.
console.log(z);   // → (không chạy đến đây vì lỗi ở trên)
// Giải thích: const không cho phép gán lại giá trị

// Đoạn 4:
const arr = [1, 2, 3];
arr.push(4);
console.log(arr); // → [1, 2, 3, 4]
// Giải thích: const không cho gán lại BIẾN, nhưng vẫn có thể
// THAY ĐỔI NỘI DUNG của object/array (vì arr trỏ đến cùng địa chỉ bộ nhớ)

// Đoạn 5:
let a = 1;
{
    let a = 2;
    console.log("Trong block:", a);  // → "Trong block: 2"
}
console.log("Ngoài block:", a);      // → "Ngoài block: 1"
// Giải thích: let có block-scope. a trong {} là biến khác hoàn toàn với a ngoài {}
```

---

### Câu A2 — Data Types & Coercion

**Dự đoán và giải thích:**

| Biểu thức | Kết quả | Giải thích |
|---|---|---|
| `typeof null` | `"object"` | Bug lịch sử từ JS 1995, không bao giờ sửa |
| `typeof undefined` | `"undefined"` | Đúng như tên |
| `typeof NaN` | `"number"` | NaN là "Not a Number" nhưng thuộc kiểu number |
| `"5" + 3` | `"53"` | `+` có string → nối chuỗi, 3 chuyển thành "3" |
| `"5" - 3` | `2` | `-` LUÔN convert sang number, "5" → 5 |
| `"5" * "3"` | `15` | `*` LUÔN convert sang number |
| `true + true` | `2` | true = 1, 1 + 1 = 2 |
| `[] + []` | `""` | Hai array rỗng → chuỗi rỗng + chuỗi rỗng = "" |
| `[] + {}` | `"[object Object]"` | [] → "", {} → "[object Object]" |
| `{} + []` | `0` | {} được parse là block, +[] → +0 = 0 |

**Tại sao `"5" + 3` khác `"5" - 3`?**

- Toán tử `+` có 2 vai trò: cộng số VÀ nối chuỗi. Khi có string, JS ưu tiên nối chuỗi.
- Toán tử `-` CHỈ có 1 vai trò: trừ số. JS bắt buộc convert cả hai về number trước.

---

### Câu A3 — So sánh == vs ===

| Biểu thức | Kết quả | Giải thích |
|---|---|---|
| `5 == "5"` | `true` | == tự chuyển "5" → 5 rồi so sánh |
| `5 === "5"` | `false` | === khác type → false ngay |
| `null == undefined` | `true` | Quy tắc đặc biệt: null và undefined == nhau |
| `null === undefined` | `false` | Khác type |
| `NaN == NaN` | `false` | NaN không bằng bất kỳ thứ gì, kể cả chính nó |
| `0 == false` | `true` | false → 0, 0 == 0 |
| `0 === false` | `false` | Khác type |
| `"" == false` | `true` | false → 0, "" → 0, 0 == 0 |

**Kết luận:** LUÔN dùng `===` và `!==` vì:
- Tránh bị surprise do type coercion tự động
- Code rõ ràng, dễ đọc, ít bug hơn
- Đây là best practice của cộng đồng JS

---

### Câu A4 — Truthy & Falsy

**6 giá trị Falsy trong JavaScript:**
```
false, 0, "", null, undefined, NaN
```

| Biểu thức | In hay không? | Lý do |
|---|---|---|
| `if ("0")` | ✅ In "A" | "0" là string không rỗng → truthy |
| `if ("")` | ❌ Không in | Chuỗi rỗng → falsy |
| `if ([])` | ✅ In "C" | Array rỗng vẫn là truthy |
| `if ({})` | ✅ In "D" | Object rỗng vẫn là truthy |
| `if (null)` | ❌ Không in | null → falsy |
| `if (0)` | ❌ Không in | 0 → falsy |
| `if (-1)` | ✅ In "G" | Số khác 0 → truthy (kể cả số âm) |
| `if (" ")` | ✅ In "H" | Space không phải chuỗi rỗng → truthy |

---

### Câu A5 — Template Literals

```javascript
const name = "Minh";
const age = 21;
const userId = "123";
const page = 2;
const title = "Card Title";
const description = "Mô tả";
const price = "99000";

// Cách 1:
const greeting = `Xin chào ${name}! Bạn ${age} tuổi.`;

// Cách 2:
const url = `https://api.example.com/users/${userId}/orders?page=${page}`;

// Cách 3:
const html = `<div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
    <span>Giá: ${price}đ</span>
</div>`;
```

---

## PHẦN C — SUY LUẬN

---

### Câu C1 — Debug JavaScript

**Code gốc có lỗi:**

```javascript
function tinhGiaGiamGia(giaBan, phanTramGiam) {
    if (phanTramGiam < 0 || phanTramGiam > 100) {
        return "Phần trăm giảm không hợp lệ"
    }
    
    var giamGia = giaBan * phanTramGiam / 100   // LỖI 1
    let giaSauGiam = giaBan - giamGia
    
    if (giaSauGiam = 0) {    // LỖI 2
        console.log("Sản phẩm miễn phí!")
    }
    
    return giaSauGiam
}

const gia = tinhGiaGiamGia("100000", 20)    // LỖI 3
console.log("Giá sau giảm: " + gia + "đ")

const gia2 = tinhGiaGiamGia(50000, 110)
console.log("Giá: " + gia2)

for (var i = 0; i < 5; i++) {    // LỖI 4 (ẩn!)
    setTimeout(function() {
        console.log("Item " + i)
    }, 1000)
}
```

**Danh sách lỗi và cách sửa:**

**Lỗi 1: Dùng `var` thay vì `const/let`**
- Dòng: `var giamGia = giaBan * phanTramGiam / 100`
- Vấn đề: Nên dùng `const` vì giá trị không thay đổi
- Sửa: `const giamGia = giaBan * phanTramGiam / 100`

**Lỗi 2: Dùng `=` (gán) thay vì `===` (so sánh)**
- Dòng: `if (giaSauGiam = 0)`
- Vấn đề: `=` gán giá trị 0 cho `giaSauGiam` và điều kiện luôn `false` (0 là falsy)
- Sửa: `if (giaSauGiam === 0)`

**Lỗi 3: Truyền string "100000" thay vì number**
- Dòng: `tinhGiaGiamGia("100000", 20)`
- Vấn đề: `"100000" * 20 / 100` → JS tự convert nên ra số, nhưng `"100000" - 20000` → `80000` (may mắn đúng do `-` convert). Cần validate input trong hàm.
- Sửa 1: Truyền number: `tinhGiaGiamGia(100000, 20)`
- Sửa 2 (tốt hơn): Thêm kiểm tra trong hàm: `if (isNaN(giaBan) || isNaN(phanTramGiam)) return "Lỗi: Input không phải số"`

**Lỗi 4 (ẩn): `var i` trong vòng lặp + setTimeout**
- Dòng: `for (var i = 0; i < 5; i++)`
- Vấn đề: `var` có function-scope, không phải block-scope. Khi setTimeout chạy sau 1000ms, vòng lặp đã xong, `i = 5`. Tất cả 5 callback đều in `"Item 5"`.
- Sửa: Dùng `let i` thay vì `var i`. `let` có block-scope, mỗi iteration có `i` riêng.

**Code đã sửa hoàn chỉnh:**

```javascript
function tinhGiaGiamGia(giaBan, phanTramGiam) {
    // Sửa lỗi 3: Validate input
    if (isNaN(giaBan) || isNaN(phanTramGiam)) {
        return "Lỗi: Input không phải số";
    }
    
    if (phanTramGiam < 0 || phanTramGiam > 100) {
        return "Phần trăm giảm không hợp lệ";
    }
    
    const giamGia = giaBan * phanTramGiam / 100;  // Sửa lỗi 1: var → const
    const giaSauGiam = giaBan - giamGia;
    
    if (giaSauGiam === 0) {  // Sửa lỗi 2: = → ===
        console.log("Sản phẩm miễn phí!");
    }
    
    return giaSauGiam;
}

const gia = tinhGiaGiamGia(100000, 20);  // Sửa lỗi 3: "100000" → 100000
console.log("Giá sau giảm: " + gia + "đ");

const gia2 = tinhGiaGiamGia(50000, 110);
console.log("Giá: " + gia2);

for (let i = 0; i < 5; i++) {  // Sửa lỗi 4: var → let
    setTimeout(function() {
        console.log("Item " + i);  // Giờ in đúng: 0, 1, 2, 3, 4
    }, 1000);
}
```
