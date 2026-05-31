# PBT_09 - ĐÁP ÁN

## PHẦN A — KIỂM TRA ĐỌC HIỂU

### A1. DOM tree

- document
  - html
    - head
    - body
      - div#app
        - header
          - h1
          - nav
            - a.active
            - a
            - a
        - main
          - form#todoForm
            - input#todoInput
            - button[type="submit"]
          - ul#todoList
            - li.todo-item
            - li.todo-item.completed

### A1. Query selectors

- Chọn thẻ `<h1>`:
  - `document.querySelector("h1")`
- Chọn input trong form:
  - `document.querySelector("#todoForm input")`
- Chọn tất cả `.todo-item`:
  - `document.querySelectorAll(".todo-item")`
- Chọn link đang active:
  - `document.querySelector("nav a.active")`
- Chọn `<li>` đầu tiên trong `#todoList`:
  - `document.querySelector("#todoList li:first-child")`
- Chọn tất cả `<a>` bên trong `<nav>`:
  - `document.querySelectorAll("nav a")`

### A2. innerHTML vs textContent

- `textContent` chỉ gán text thuần, không hiểu HTML.
- `innerHTML` gán HTML string và browser sẽ parse thành nodes.
- Dùng `textContent` khi hiển thị dữ liệu người dùng hoặc text đơn thuần.
- Dùng `innerHTML` khi cần chèn HTML phức tạp, nhưng phải cẩn thận bảo mật.

#### XSS với innerHTML

`innerHTML` có thể chèn mã độc nếu dữ liệu từ user chưa được lọc.

Ví dụ nguy hiểm:

```javascript
const userInput = document.querySelector("#search").value;
document.querySelector("#result").innerHTML = userInput; // NGUY HIỂM
```

Sửa an toàn:

```javascript
const userInput = document.querySelector("#search").value;
document.querySelector("#result").textContent = userInput;
```

### A3. Event Bubbling

Khi click vào button, thứ tự log bình thường là:

- `BUTTON`
- `INNER`
- `OUTER`

Nếu dùng `e.stopPropagation()` trong button handler thì chỉ có:

- `BUTTON`

vì sự kiện không nổi bọt lên cha.

## PHẦN C — DEBUG & PHÂN TÍCH

### C1. Sửa lỗi code

Các lỗi chính:

1. `addEventListener("onclick", ...)` phải là `"click"`.
2. `countDisplay = count;` phải gán vào `textContent`, không gán element bằng số.
3. `historyList.innerHTML = null;` nên dùng `historyList.innerHTML = "";`.
4. `item.remove;` thiếu dấu ngoặc `()`.
5. Khi load từ localStorage, `count` được lưu dưới dạng string, cần parse lại.
6. Cần load cả `history` và khôi phục nội dung nếu cần.
7. `deleteHistory(this)` đúng, nhưng nếu element là `li`, dùng `element.remove()` đơn giản hơn.

Đoạn sửa đúng:

```javascript
const countDisplay = document.querySelector(".count");
const historyList = document.getElementById("history");
let count = 0;

function saveState() {
  localStorage.setItem("count", count);
  localStorage.setItem("history", historyList.innerHTML);
}

function loadState() {
  const savedCount = localStorage.getItem("count");
  const savedHistory = localStorage.getItem("history");
  count = savedCount !== null ? Number(savedCount) : 0;
  countDisplay.textContent = count;
  if (savedHistory) {
    historyList.innerHTML = savedHistory;
  }
}

function deleteHistory(element) {
  element.remove();
}

window.addEventListener("load", loadState);
window.addEventListener("beforeunload", saveState);
```

### C2. Performance

- Bind event lên 1000 element riêng lẻ kém vì mỗi element cần một listener riêng, tốn bộ nhớ và chi phí xử lý khi gán.
- Event Delegation chỉ gán 1 listener lên container, xử lý sự kiện từ các con bằng `event.target`, giảm overhead.

Refactor dùng DocumentFragment:

```javascript
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  div.textContent = `Item ${i}`;
  fragment.appendChild(div);
}
document.body.appendChild(fragment);
```

`DocumentFragment` nhanh hơn vì tất cả nodes được thêm vào bộ nhớ trước, chỉ gây một lần reflow/repaint khi append vào DOM.
