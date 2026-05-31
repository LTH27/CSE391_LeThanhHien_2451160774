# 📋 ĐÁP ÁN PHẦN A + C — PBT_08

---

## PHẦN A — KIỂM TRA ĐỌC HIỂU

---

### Câu A1 — Function Declaration vs Expression vs Arrow

```javascript
// ============================================================
// 3 cách viết cùng 1 hàm tinhThueBaoHiem(luong)
// ============================================================

// CÁCH 1: Function Declaration
function tinhThueBaoHiem_declaration(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return {
        thuong: luong,
        thuc_nhan: luong - thue
    };
}

// CÁCH 2: Function Expression
const tinhThueBaoHiem_expression = function(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return {
        thuong: luong,
        thuc_nhan: luong - thue
    };
};

// CÁCH 3: Arrow Function
const tinhThueBaoHiem_arrow = (luong) => {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return {
        thuong: luong,
        thuc_nhan: luong - thue
    };
};
```

**Hoisting có khác nhau không?**

| | Function Declaration | Function Expression | Arrow Function |
|---|---|---|---|
| Hoisting | ✅ Được hoisted hoàn toàn | ❌ Không hoisted | ❌ Không hoisted |
| Gọi trước khai báo | ✅ OK | ❌ ReferenceError | ❌ ReferenceError |

**Ví dụ code minh hoạ:**

```javascript
// ✅ Function Declaration → gọi TRƯỚC khai báo được
console.log(cong_declaration(3, 4));  // → 7  (OK!)

function cong_declaration(a, b) { return a + b; }


// ❌ Function Expression → gọi TRƯỚC khai báo → lỗi
console.log(cong_expression(3, 4));   // → ReferenceError!

const cong_expression = function(a, b) { return a + b; };


// ❌ Arrow Function → tương tự Function Expression
console.log(cong_arrow(3, 4));        // → ReferenceError!

const cong_arrow = (a, b) => a + b;
```

**Lý do:** Function Declaration được "nâng" (hoisted) toàn bộ thân hàm lên đầu scope.
Function Expression và Arrow Function chỉ được hoisted phần khai báo biến (`const`), thân hàm chưa gán → TDZ → lỗi.

---

### Câu A2 — Scope & Closure

**Dự đoán output:**

```javascript
// Đoạn 1: counter() dùng Closure
const c = counter();
console.log(c.increment());  // → 1   (count: 0 → 1)
console.log(c.increment());  // → 2   (count: 1 → 2)
console.log(c.increment());  // → 3   (count: 2 → 3)
console.log(c.decrement());  // → 2   (count: 3 → 2)
console.log(c.getCount());   // → 2   (đọc count hiện tại)
```

**Giải thích Closure:** Biến `count` được khai báo trong `counter()`. Sau khi `counter()` chạy xong, bình thường `count` sẽ bị xóa. Nhưng vì 3 hàm con (`increment`, `decrement`, `getCount`) vẫn giữ tham chiếu đến `count`, JavaScript giữ nó tồn tại trong bộ nhớ → đây là Closure.

```javascript
// Đoạn 2: var vs let trong setTimeout
// Output sau ~100ms (var loop):
// var: 3
// var: 3
// var: 3

// Output sau ~200ms (let loop):
// let: 0
// let: 1
// let: 2
```

**Tại sao `var` và `let` khác nhau?**

- **`var i`**: function-scoped, chỉ có 1 biến `i` duy nhất cho cả 3 vòng lặp. Khi setTimeout callback chạy (sau 100ms), vòng lặp đã kết thúc, `i = 3`. Cả 3 callback đều đọc cùng 1 biến `i = 3`.

- **`let j`**: block-scoped, mỗi iteration tạo ra 1 biến `j` riêng biệt (j=0, j=1, j=2). Mỗi callback "nhớ" phiên bản `j` của iteration đó → in ra 0, 1, 2 đúng như mong đợi.

---

### Câu A3 — Array Methods (1 dòng mỗi câu)

```javascript
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 1. Số chẵn
const chanNums = nums.filter(n => n % 2 === 0);
// → [2, 4, 6, 8, 10]

// 2. Nhân mỗi số với 3
const nhan3 = nums.map(n => n * 3);
// → [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]

// 3. Tổng tất cả
const tong = nums.reduce((sum, n) => sum + n, 0);
// → 55

// 4. Số đầu tiên > 7
const dauTien = nums.find(n => n > 7);
// → 8

// 5. Có số > 10 không?
const coSoLon = nums.some(n => n > 10);
// → false

// 6. Tất cả đều > 0?
const tatCaDuong = nums.every(n => n > 0);
// → true

// 7. Mảng mô tả chẵn/lẻ
const moTa = nums.map(n => `Số ${n} là ${n % 2 === 0 ? "chẵn" : "lẻ"}`);
// → ["Số 1 là lẻ", "Số 2 là chẵn", ...]

// 8. Đảo ngược (không mutate gốc)
const daoBien = [...nums].reverse();
// → [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```

---

### Câu A4 — Object Destructuring & Spread

**Dự đoán từng dòng:**

```javascript
const product = {
    name: "iPhone 16",
    price: 25990000,
    specs: { ram: 8, storage: 256, color: "Titan" }
};

const { name, price, specs: { ram, color } } = product;
console.log(name, price, ram, color);
// → "iPhone 16" 25990000 8 "Titan"
// Nested destructuring: specs: { ram, color } trích ram và color từ specs

console.log(specs);
// → ReferenceError: specs is not defined
// Vì khi viết specs: { ram, color }, ta đặt alias để lấy sâu hơn,
// KHÔNG tạo biến tên specs. Muốn có specs thì phải viết: const { specs } = product;

// Spread
const updated = { ...product, price: 23990000, sale: true };
console.log(updated.price);    // → 23990000  (override)
console.log(updated.sale);     // → true       (thêm mới)
console.log(product.price);    // → 25990000   (gốc KHÔNG đổi — spread tạo object mới)

// Spread gotcha — Shallow Copy
const copy = { ...product };
copy.specs.ram = 16;
console.log(product.specs.ram);
// → 16  (KHÔNG phải 8!)
// Lý do: Spread chỉ copy 1 lớp ngoài (shallow copy).
// copy.specs và product.specs vẫn trỏ đến CÙNG 1 object trong bộ nhớ.
// Sửa copy.specs.ram → sửa luôn object gốc!
// Để deep copy: dùng JSON.parse(JSON.stringify(product)) hoặc structuredClone(product)
```

---

## PHẦN C — SUY LUẬN

---

### Câu C1 — Refactor Code

**Code gốc (ugly):**

```javascript
function processOrders(orders) {
    var result = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].status === "completed") {
            if (orders[i].total > 100000) {
                var item = {};
                item.id = orders[i].id;
                item.customer = orders[i].customer;
                item.total = orders[i].total;
                item.discount = orders[i].total * 0.1;
                item.finalTotal = orders[i].total - item.discount;
                result.push(item);
            }
        }
    }
    // Bubble sort ...
    return result;
}
```

**Code đã refactor (≤ 10 dòng):**

```javascript
function processOrders(orders) {
    return orders
        .filter(o => o.status === "completed" && o.total > 100000)
        .map(({ id, customer, total }) => ({
            id,
            customer,
            total,
            discount: total * 0.1,
            finalTotal: total * 0.9
        }))
        .sort((a, b) => b.finalTotal - a.finalTotal);
}
```

**Điểm cải thiện:**
- Xóa `var` → dùng arrow functions + destructuring
- Gộp 2 `if` lồng nhau thành 1 `.filter()` với điều kiện `&&`
- Thay `for` loop + `push` bằng `.map()` — ngắn và rõ ý hơn
- Thay bubble sort O(n²) bằng `.sort()` built-in
- Dùng destructuring `{ id, customer, total }` thay vì gán từng field
- `finalTotal: total * 0.9` thay vì `total - total * 0.1` (ngắn hơn)

---

### Câu C2 — miniArray tự viết

```javascript
const miniArray = {
    // map: duyệt từng phần tử, áp dụng fn, trả mảng mới
    map(arr, fn) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(fn(arr[i], i, arr));
        }
        return result;
    },

    // filter: duyệt, giữ lại phần tử mà fn trả true
    filter(arr, fn) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            if (fn(arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }
        return result;
    },

    // reduce: tích lũy từ initialValue qua từng phần tử
    reduce(arr, fn, initialValue) {
        let accumulator = initialValue;
        for (let i = 0; i < arr.length; i++) {
            accumulator = fn(accumulator, arr[i], i, arr);
        }
        return accumulator;
    }
};

// Test
console.log(miniArray.map([1,2,3], x => x * 2));             // → [2, 4, 6]
console.log(miniArray.filter([1,2,3,4], x => x > 2));        // → [3, 4]
console.log(miniArray.reduce([1,2,3,4], (a, b) => a + b, 0)); // → 10
```

**Giải thích cách hoạt động của `reduce`:**

`reduce` nhận 3 thứ: mảng, hàm gộp, giá trị khởi đầu.

Với `reduce([1,2,3,4], (a,b) => a+b, 0)`:
1. Vòng 1: `acc=0`, phần tử `1` → `fn(0, 1) = 1` → acc = 1
2. Vòng 2: `acc=1`, phần tử `2` → `fn(1, 2) = 3` → acc = 3
3. Vòng 3: `acc=3`, phần tử `3` → `fn(3, 3) = 6` → acc = 6
4. Vòng 4: `acc=6`, phần tử `4` → `fn(6, 4) = 10` → acc = 10
5. Trả về 10.
