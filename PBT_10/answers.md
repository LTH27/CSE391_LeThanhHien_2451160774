# PBT_10 - ĐÁP ÁN

## PHẦN A — KIỂM TRA ĐỌC HIỂU

### A1. Sync vs Async

Thứ tự output:

1. 1 - Start
2. 4 - End
3. 3 - Promise
4. 6 - Promise 2
5. 2 - Timeout 0ms
6. 7 - Nested timeout
7. 5 - Timeout 100ms

Giải thích:
- `console.log("1 - Start")` chạy đồng bộ.
- `setTimeout(..., 0)` đưa callback vào macrotask queue.
- `Promise.resolve().then(...)` đưa callback vào microtask queue.
- Sau khi stack trống, microtasks chạy trước macrotasks.
- `Promise 2` tạo ra `setTimeout(...)` mới, vì vậy `Nested timeout` cũng vào macrotask và chạy sau `Timeout 0ms`.

### A2. Fetch API

1. `await fetch(...)` — `fetch` trả về một Promise chứa `Response`. `await` dừng hàm async tạm thời để chờ Promise resolve.
2. `response.ok` false khi HTTP status nằm ngoài 200-299, ví dụ 404 Not Found, 500 Internal Server Error, 429 Too Many Requests.
3. `response.json()` trả Promise vì việc parse JSON là bất đồng bộ. Phải `await` để nhận được object dữ liệu.
4. `try...catch` bắt được lỗi network, lỗi JSON parse, và các lỗi do `throw new Error(...)` khi `response.ok` false. Không bắt được lỗi HTTP nếu không `throw`.

### A3. Promise States

- Pending → Fulfilled: Promise hoàn thành thành công.
- Pending → Rejected: Promise thất bại.

Callback Hell: nhiều callback lồng nhau khó đọc và khó bảo trì.

Ví dụ callback hell:

```javascript
fetchData((data) => {
  fetchMore(data.id, (more) => {
    fetchExtra(more.value, (result) => {
      saveResult(result, () => {
        console.log("Done");
      });
    });
  });
});
```

Refactor async/await:

```javascript
async function run() {
  const data = await fetchData();
  const more = await fetchMore(data.id);
  const result = await fetchExtra(more.value);
  await saveResult(result);
  console.log("Done");
}
```

## PHẦN C — PHÂN TÍCH

### C1. Error Handling Strategy

1. Network errors:
   - Hiển thị thông báo `Mất kết nối. Vui lòng kiểm tra mạng.`
   - Cho user retry.
   - Có thể dùng `navigator.onLine` để kiểm tra offline.

2. API errors:
   - 400-499: lỗi client, hiện thông báo rõ ràng.
   - 404: `Không tìm thấy dữ liệu.`
   - 429: `Quá nhiều yêu cầu, thử lại sau vài giây.`
   - 500-599: lỗi server, đề nghị thử lại sau.

3. Timeout:

```javascript
async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

4. Retry logic:

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response;
    } catch (error) {
      attempt += 1;
      if (attempt >= maxRetries || !error.name === "TypeError") {
        throw error;
      }
    }
  }
}
```

### C2. Promise methods

| Method | Khi nào resolve? | Khi nào reject? | Use case |
|---|---|---|---|
| `.all()` | Khi tất cả Promise đều fulfilled | Nếu 1 Promise reject | Khi cần mọi request phải thành công cùng lúc |
| `.allSettled()` | Khi tất cả Promise hoàn thành (fulfilled hoặc rejected) | Không reject | Khi muốn biết kết quả từng request, kể cả lỗi |
| `.race()` | Khi Promise đầu tiên fulfilled/rejected | Khi Promise đầu tiên fulfilled/rejected | Khi cần kết quả nhanh nhất, ví dụ timeout hoặc cache |
| `.any()` | Khi ít nhất 1 Promise fulfilled | Khi tất cả Promise rejected | Khi cần 1 kết quả thành công từ nhiều nguồn |

Ví dụ thực tế:

- `.all()`: tải dữ liệu user + config + theme, nếu thiếu file nào thì dừng.
- `.allSettled()`: tải widget độc lập, mỗi widget vẫn hiển thị riêng.
- `.race()`: lấy dữ liệu từ cache hoặc API nhanh nhất.
- `.any()`: dùng nhiều endpoint backup, chỉ cần 1 trả thành công.
