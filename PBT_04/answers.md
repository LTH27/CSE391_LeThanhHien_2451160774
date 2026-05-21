# ANSWERS — PBT 04: CSS Layout

---

## PHẦN A — KIỂM TRA ĐỌC HIỂU

### Câu A1 — 5 Loại Positioning

| Position | Vẫn chiếm chỗ trong flow? | Tham chiếu vị trí | Cuộn theo trang? | Use case |
|----------|---------------------------|-------------------|------------------|----------|
| `static` | Có | Không áp dụng (không dùng top/left) | Có | Mặc định, phần tử thông thường |
| `relative` | Có | Chính nó (vị trí gốc) | Có | Dịch chuyển nhẹ, làm "anchor" cho absolute con |
| `absolute` | **Không** | Nearest positioned ancestor | Có (cùng trang) | Badge, tooltip, dropdown menu |
| `fixed` | **Không** | Viewport (cửa sổ trình duyệt) | **Không** (luôn cố định) | Header dính, nút scroll-to-top |
| `sticky` | Có (ban đầu) | Scroll container | Dính lại khi đến ngưỡng `top` | Sidebar dính, table header |

**Câu hỏi thêm — "Nearest Positioned Ancestor":**

- `absolute` sẽ tham chiếu **body** khi không có ancestor nào có `position` khác `static`.
- `absolute` sẽ tham chiếu **parent** (hoặc ancestor gần nhất) khi parent đó có `position: relative`, `absolute`, `fixed`, hoặc `sticky`.
- **Nearest positioned ancestor** = phần tử cha gần nhất mà có thuộc tính `position` khác `static`. Nếu không tìm thấy, mặc định là `<html>` (gần như tương đương `body`).

Ví dụ:
```html
<div class="wrapper" style="position: relative;">   <!-- ← anchor -->
  <div class="card">
    <span class="badge" style="position: absolute; top: 0; right: 0;">HOT</span>
  </div>
</div>
```
Badge sẽ tham chiếu `.wrapper` vì đó là positioned ancestor gần nhất.

---

### Câu A2 — Dự đoán Layout Flexbox / Grid

**Trường hợp 1:**
```
.container { display: flex; }
.item { flex: 1; }  /* 4 items */
```
→ 4 items nằm ngang, **chia đều chiều rộng** (mỗi item 25%). Tất cả cùng hàng, không wrap.
```
[ Item 1 ][ Item 2 ][ Item 3 ][ Item 4 ]
```

**Trường hợp 2:**
```
.container { display: flex; flex-wrap: wrap; }
.item { width: 45%; margin: 2.5%; }  /* 6 items */
```
→ Mỗi item chiếm ~50% (45% + 2×2.5% margin). Được **2 item/hàng**, tổng 3 hàng.
```
[ Item 1  ][ Item 2  ]
[ Item 3  ][ Item 4  ]
[ Item 5  ][ Item 6  ]
```

**Trường hợp 3:**
```
.container { display: flex; justify-content: space-between; align-items: center; }
/* 3 items */
```
→ Item 1 bên trái, Item 2 giữa, Item 3 bên phải. Cả 3 được căn giữa theo chiều dọc.
```
[Item1]        [Item2]        [Item3]
```

**Trường hợp 4:**
```
.container { display: grid; grid-template-columns: 200px 1fr 200px; gap: 20px; }
/* 3 items */
```
→ 3 cột: cột 1 = 200px cố định, cột 2 = chiếm toàn bộ không gian còn lại, cột 3 = 200px cố định.
```
[200px][ ←  1fr  → ][200px]
```

**Trường hợp 5:**
```
.container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
/* 7 items */
```
→ 3 cột đều nhau. 7 items → **3 hàng**: hàng 1 (3 items), hàng 2 (3 items), hàng 3 (1 item ở cột đầu).
```
[ Item 1 ][ Item 2 ][ Item 3 ]
[ Item 4 ][ Item 5 ][ Item 6 ]
[ Item 7 ][         ][        ]
```
Item cuối nằm ở cột đầu của hàng 3, 2 ô còn lại trống.

---

## PHẦN C — SUY LUẬN

### Câu C1 — Flexbox vs Grid: Khi nào dùng gì?

**1. Navigation bar ngang (logo + menu + buttons)**
→ **Flexbox**
Vì navbar là layout 1 chiều (ngang). Flexbox với `justify-content: space-between` + `align-items: center` là lựa chọn hoàn hảo.

**2. Lưới ảnh Instagram (3 cột đều nhau, số ảnh không biết trước)**
→ **Grid**
Vì đây là layout 2 chiều rõ ràng. `grid-template-columns: repeat(3, 1fr)` tự động tạo hàng mới khi thêm ảnh. Grid kiểm soát cả hàng lẫn cột.

**3. Layout blog: main content + sidebar**
→ **Grid**
Vì đây là layout page-level 2 chiều. `grid-template-columns: 1fr 300px` rõ ràng hơn Flexbox. Grid dễ kiểm soát tỷ lệ hơn.

**4. Footer với 4 cột thông tin**
→ **Grid** hoặc **Flexbox** đều được, nhưng ưu tiên **Grid**
Grid với `repeat(4, 1fr)` giúp 4 cột hoàn toàn đều nhau. Nếu số cột cố định, Grid là lựa chọn tự nhiên hơn.

**5. Card sản phẩm (ảnh trên, text giữa, nút dưới — nút luôn dính đáy)**
→ **Flexbox** (cho bên trong card)
Dùng `display: flex; flex-direction: column` trên card. Sau đó `margin-top: auto` trên nút "Mua" để đẩy nút xuống đáy. Đây là pattern 1 chiều theo cột.

---

### Câu C2 — Debug Flexbox

**Lỗi 1: Cards không đều chiều cao — nút "Mua" bị nhảy lên/xuống**

**Nguyên nhân:** Card không có `display: flex; flex-direction: column`, nên không thể dùng `margin-top: auto` trên nút. Hơn nữa, các card trong container flex mặc định `align-items: stretch` (đều cao), nhưng nút "Mua" không bị đẩy xuống đáy.

**Sửa:**
```css
.card-container { display: flex; flex-wrap: wrap; }
.card {
  width: 30%;
  margin: 1.5%;
  display: flex;              /* THÊM */
  flex-direction: column;     /* THÊM */
}
.card img { width: 100%; }
.card h3 { font-size: 18px; }
.card .btn {
  padding: 10px;
  margin-top: auto;           /* THÊM — đẩy nút xuống đáy */
}
```

---

**Lỗi 2: Items vẫn dính góc trái trên, không căn giữa**

**Nguyên nhân:** `.hero` có `display: flex` nhưng thiếu `justify-content: center` và `align-items: center`. Mặc định flex-direction là `row`, items xếp ngang từ trái. `text-align: center` chỉ căn text bên trong, không căn vị trí của `.hero-content` trong container.

**Sửa:**
```css
.hero {
    height: 100vh;
    display: flex;
    justify-content: center;  /* THÊM — căn giữa ngang */
    align-items: center;      /* THÊM — căn giữa dọc */
}
.hero-content {
    text-align: center;
}
```

---

**Lỗi 3: Sidebar bị co lại khi content quá dài**

**Nguyên nhân:** Sidebar có `width: 250px` nhưng không có `flex-shrink: 0`. Mặc định `flex-shrink: 1`, nghĩa là khi container thiếu chỗ, sidebar sẽ bị co lại để nhường chỗ cho content.

**Sửa:**
```css
.layout { display: flex; }
.sidebar {
  width: 250px;
  flex-shrink: 0;    /* THÊM — không cho sidebar co lại */
}
.content { flex: 1; }
```
