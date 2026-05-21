# PBT 03 — CSS Core: Bài làm lý thuyết

---

## PHẦN A — KIỂM TRA ĐỌC HIỂU

### Câu A1 (5đ) — 3 Cách nhúng CSS

**1. Inline CSS** — sử dụng thuộc tính `style` trực tiếp trên element

```html
<p style="color: red; font-size: 16px;">Text</p>
```

- **Ưu điểm:** Nhanh, áp dụng trực tiếp, specificity cao
- **Nhược điểm:** Không tái sử dụng, khó bảo trì, trộn lẫn HTML và CSS
- **Khi nào dùng:** Fix nhanh, email HTML, override tạm thời

**2. Internal CSS** — sử dụng thẻ `<style>` trong `<head>`

```html
<head>
  <style>
    p { color: blue; }
  </style>
</head>
```

- **Ưu điểm:** Gọn trong 1 file, không cần request thêm
- **Nhược điểm:** Chỉ áp dụng cho 1 trang, không cache riêng
- **Khi nào dùng:** Single page, prototype, trang đơn lẻ

**3. External CSS** — sử dụng thẻ `<link>` trỏ đến file `.css`

```html
<link rel="stylesheet" href="style.css">
```

- **Ưu điểm:** Tái sử dụng nhiều trang, cache được, tách biệt concern
- **Nhược điểm:** Thêm HTTP request, phụ thuộc file ngoài
- **Khi nào dùng:** Dự án thực tế, multi-page sites

**Câu hỏi thêm:** Nếu cùng 1 element có cả 3 cách CSS đồng thời, **inline CSS thắng** vì có specificity cao nhất `(1,0,0,0)`. Thứ tự ưu tiên: inline > internal/external (tùy thứ tự load). Inline chỉ thua `!important`.

---

### Câu A2 (8đ) — CSS Selectors — Dự đoán kết quả

| # | Selector | Chọn phần tử | Nội dung |
|---|----------|--------------|----------|
| 1 | `h1` | `<h1>ShopTLU</h1>` | "ShopTLU" |
| 2 | `.price` | 2 phần tử `<p class="price">` | "25.990.000đ" và "45.990.000đ" |
| 3 | `#app header` | `<header class="top-bar dark">` | Toàn bộ header |
| 4 | `nav a:first-child` | `<a href="/" class="active">Home</a>` | Link đầu tiên trong nav |
| 5 | `.product.featured h2` | `<h2>MacBook Pro</h2>` | h2 trong article có cả 2 class |
| 6 | `article > p` | 4 phần tử `<p>` là con trực tiếp của article | "25.990.000đ", "Mô tả sản phẩm...", "45.990.000đ", "Mô tả sản phẩm..." |
| 7 | `a[href="/"]` | `<a href="/" class="active">Home</a>` | Link có href="/" |
| 8 | `.top-bar.dark h1` | `<h1>ShopTLU</h1>` | h1 trong element có cả 2 class |

---

### Câu A3 (7đ) — Box Model — Tính toán kích thước

**Trường hợp 1: `content-box` (mặc định)**

```css
.box-1 { width: 400px; padding: 20px; border: 5px solid black; margin: 10px; }
```

```
Chiều rộng hiển thị = width + padding-left + padding-right + border-left + border-right
                    = 400 + 20 + 20 + 5 + 5
                    = 450px

Không gian chiếm trên trang = chiều rộng hiển thị + margin-left + margin-right
                             = 450 + 10 + 10
                             = 470px
```

**Trường hợp 2: `border-box`**

```css
.box-2 { box-sizing: border-box; width: 400px; padding: 20px; border: 5px solid black; margin: 10px; }
```

```
Chiều rộng hiển thị = width = 400px (border-box bao gồm padding + border)

Kích thước content thực tế = width - padding-left - padding-right - border-left - border-right
                            = 400 - 20 - 20 - 5 - 5
                            = 350px

Không gian chiếm trên trang = 400 + 10 + 10 = 420px
```

**Trường hợp 3: Margin Collapse**

```css
.box-a { margin-bottom: 25px; }
.box-b { margin-top: 40px; }
```

```
Khoảng cách giữa box-a và box-b = 40px (KHÔNG PHẢI 65px)
```

**Giải thích:** Vertical margin collapse — khi 2 block elements liền kề nhau theo chiều dọc, `margin-bottom` của element trên và `margin-top` của element dưới sẽ **KHÔNG cộng lại**, mà chỉ lấy giá trị **LỚN HƠN**: `max(25px, 40px) = 40px`. Đây là hành vi mặc định của CSS để tránh khoảng cách quá lớn giữa các block elements.

**Nâng cao:** Nếu `.box-a` có `margin-bottom: -10px` và `.box-b` có `margin-top: 40px`:

```
Khi có negative margin: khoảng cách = max(positive) + min(negative)
= 40px + (-10px) = 30px
```

---

### Câu A4 (5đ) — Specificity (Độ ưu tiên)

Cho element: `<p class="price" id="main-price">`

| Rule | Selector | Declaration | Specificity |
|------|----------|------------|-------------|
| A | `p` | `color: black;` | `(0, 0, 1)` |
| B | `.price` | `color: blue;` | `(0, 1, 0)` |
| C | `#main-price` | `color: red;` | `(1, 0, 0)` |
| D | `p.price` | `color: green;` | `(0, 1, 1)` |

1. **Specificity scores:** Đã liệt kê ở bảng trên.
2. **Element hiển thị màu đỏ (red)** — Rule C thắng vì ID selector có specificity cao nhất: `(1,0,0)` > `(0,1,1)` > `(0,1,0)` > `(0,0,1)`.
3. **Nếu thêm `style="color: orange;"`** → Element có **màu cam (orange)** vì inline style có specificity `(1,0,0,0)` cao hơn tất cả selector trong stylesheet.
4. **Nếu Rule A thêm `!important`** → `p { color: black !important; }` → Element có **màu đen (black)** vì `!important` override tất cả specificity thông thường, kể cả inline style. Chỉ thua `!important` khác có specificity cao hơn.

---

## PHẦN B — GHI CHÚ THỰC HÀNH

### Bài B1 — Liệt kê 5 loại selector đã dùng

| # | Loại selector | Ví dụ đã dùng |
|---|--------------|----------------|
| 1 | **Element selector** | `body`, `h1`, `table`, `th`, `td`, `footer`, `nav`, `a` |
| 2 | **Class selector** | `.active`, `.skill-table`, `.nav-link` |
| 3 | **ID selector** | `#main-header`, `#footer` |
| 4 | **Descendant selector** | `nav a`, `.skill-table th`, `#main-header h1` |
| 5 | **Pseudo-class selector** | `a:hover`, `tr:nth-child(even)`, `tr:hover`, `a:first-child` |

---

### Bài B2 — Box Model Lab kết quả

```
Hộp 1 (content-box): chiều rộng thực tế = 350px (300 + 20×2 + 5×2)
Hộp 2 (border-box):  chiều rộng thực tế = 300px (padding và border nằm trong 300px)
```

**Giải thích:**
- `content-box` tính `width` chỉ cho content area → padding và border cộng thêm bên ngoài.
- `border-box` tính `width` bao gồm cả content + padding + border → tổng kích thước = width đã set.

---

### Bài B3 — 10 CSS Rules Specificity

| # | Selector | Màu | Specificity |
|---|----------|-----|-------------|
| 1 | `*` | `gray` | `(0, 0, 0)` |
| 2 | `p` | `black` | `(0, 0, 1)` |
| 3 | `.text` | `blue` | `(0, 1, 0)` |
| 4 | `.highlight` | `orange` | `(0, 1, 0)` |
| 5 | `p.text` | `teal` | `(0, 1, 1)` |
| 6 | `.text.highlight` | `purple` | `(0, 2, 0)` |
| 7 | `p.text.highlight` | `brown` | `(0, 2, 1)` |
| 8 | `#demo` | `red` | `(1, 0, 0)` |
| 9 | `#demo.text` | `crimson` | `(1, 1, 0)` |
| 10 | `#demo.text.highlight` | `magenta` | `(1, 2, 0)` |

**Kết quả:** Element cuối cùng hiển thị **màu magenta** vì Rule 10 có specificity cao nhất `(1, 2, 0)`.

**Thay đổi thứ tự rules:** Kết quả **KHÔNG đổi** vì tất cả specificity đều khác nhau. Thứ tự trong stylesheet chỉ ảnh hưởng khi specificity bằng nhau (rule viết sau thắng).

---

## PHẦN C — DEBUG & SUY LUẬN

### Câu C1 (10đ) — Debug CSS Layout

**1. Tính chiều rộng thực tế (content-box):**

```
Sidebar = width + padding-left + padding-right + border-left + border-right
        = 300 + 20 + 20 + 1 + 1
        = 342px

Content = width + padding-left + padding-right + border-left + border-right
        = 660 + 30 + 30 + 1 + 1
        = 722px
```

**2. Giải thích tại sao layout bị vỡ:**

```
Tổng = 342 + 722 = 1064px > 960px (container)
```

Vì dùng `content-box` (mặc định), padding và border cộng thêm vào width, khiến tổng chiều rộng 2 cột vượt quá container → content bị đẩy xuống dòng mới.

**3. Hai cách sửa:**

**Cách 1: Dùng `border-box`**

```css
.sidebar, .content {
    box-sizing: border-box;
}
```

Giữ nguyên width gốc. `border-box` đảm bảo padding + border nằm trong width.
Sidebar = 300px, Content = 660px → Tổng = 960px ✓

**Cách 2: Không dùng `border-box` — tính lại width**

```css
.sidebar {
    width: 258px;  /* 300 - 20×2 - 1×2 = 258 */
}
.content {
    width: 598px;  /* 660 - 30×2 - 1×2 = 598 */
}
```

Tổng: `(258 + 40 + 2) + (598 + 60 + 2) = 300 + 660 = 960px` ✓

---

### Câu C2 (10đ) — Cascade Puzzle

**1. "Sản phẩm A"** — `h2.title.highlight` trong `#featured .card`:

- `font-size` = **20px** — từ rule `.card .title { font-size: 20px; }` (specificity `0,2,0`)
- `color` = **green** — `.highlight { color: green !important; }` thắng tất cả nhờ `!important`, kể cả `#featured .title { color: red; }` (specificity `1,1,0` nhưng không có `!important`)

**2. "Mô tả sản phẩm A"** — `p` trong `#featured .card`:

- `color` = **blue** — Rule `.card p { color: inherit; }` (specificity `0,1,1`) kế thừa từ `.card { color: blue; }`. Giá trị `inherit` lấy giá trị computed từ parent `.card`, tức là `blue`.

**3. "Sản phẩm B"** — `h2.title` trong `.card` thứ 2 (không có `#featured`):

- `font-size` = **20px** — từ `.card .title { font-size: 20px; }` (specificity `0,2,0`)
- `color` = **blue** — Kế thừa từ `.card { color: blue; }`. Rule `#featured .title` không match vì element này không nằm trong `#featured`. `h2` inherit color từ parent `.card` = `blue`.

**4. "Mô tả sản phẩm B"** — `p.highlight` trong `.card` thứ 2:

- `color` = **green** — `.highlight { color: green !important; }` thắng tất cả nhờ `!important`. Mặc dù `.card p { color: inherit; }` cũng match, nhưng `!important` luôn override.
