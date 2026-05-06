##### Câu A1:
- `type="email"` Ô nhập văn bản, trình duyệt kiểm tra có ký tự @ và định dạng email. Dùng cho form đăng ký / đăng nhập / nhận thông báo đơn hàng
- `type="password"` Ô nhập nhưng ký tự bị ẩn (•••••) .Không có validation mặc định mạnh, nhưng thường kết hợp minlength  Dùng khi đăng nhập hoặc tạo tài khoản
- `type="number"`  Ô nhập số, có nút tăng/giảm (spinner) . Chỉ cho nhập số, có thể giới hạn min, max . Dùng chọn số lượng sản phẩm
- `type="tel"`  Ô nhập số điện thoại . Không validate chặt (chỉ gợi ý bàn phím số trên mobile) . Dùng nhập số điện thoại khách hàng
- `type="url"`  Ô nhập link . Tự kiểm tra định dạng URL (http/https) . Dùng khi nhập link website (ví dụ shop đối tác)
- `type="date"` Hiển thị bộ chọn ngày (calendar picker) . Đảm bảo format ngày hợp lệ . Dùng chọn ngày giao hàng hoặc ngày sinh
- `type="time"`  Bộ chọn giờ (time picker) . Kiểm tra định dạng giờ hợp lệ . Dùng chọn khung giờ giao hàng
- `type="checkbox"`  Ô vuông tick chọn nhiều lựa chọn . Không validation riêng, nhưng có thể dùng required . Dùng chọn nhiều sản phẩm hoặc đồng ý điều khoản
- `type="radio"`  Nút tròn, chỉ chọn 1 trong nhiều . Đảm bảo chỉ chọn một giá trị trong nhóm . Dùng chọn phương thức thanh toán (COD / Visa / Momo)
- `type="file"`  Nút chọn file từ máy . Có thể giới hạn loại file (accept) . Dùng upload ảnh đánh giá sản phẩm hoặc avatar

#### Câu A2:
````<!-- Trường hợp 1 -->
<input type="text" required value="">   <!-- User để trống -->````
Không submit được, lỗi thiếu giá trị 
````<!-- Trường hợp 2 -->
<input type="email" value="abc">        <!-- User gõ "abc" -->````
Không submit được, lỗi sai format email
````<!-- Trường hợp 3 -->
<input type="number" min="1" max="10" value="15"> <!-- User gõ 15 -->````
Không submit được, lỗi điền quá value , max là 10 điền 15
````<!-- Trường hợp 4 -->
<input type="text" pattern="[0-9]{10}" value="abc123"> <!-- User gõ "abc123" -->````
Không submit được, lỗi sai định dạng , yêu cầu điền 10 chữ nhưng điền cả số và chữ 
````<!-- Trường hợp 5 -->
<input type="password" minlength="8" value="123">  <!-- User gõ "123" -->````
Không submit được, min yêu cầu nhập 8 kí tự nhưng chỉ nhập 3
````
#### Câu A3:
1. `<label for="email">` quan trọng vì:

- Giúp screen reader đọc tên của input
- Người dùng biết ô đó dùng để nhập gì (ví dụ: “Email”)
- Không có label thì sẽ không hiểu nội dung input
2. Khi nào dùng `<fieldset>` + `<legend>`
- Khi có nhóm input liên quan
 Ví dụ: nhóm chọn phương thức thanh toán (radio)
`<legend>` mô tả ý nghĩa chung của nhóm
3. aria-label dùng khi nào?
- Dùng khi không có text hiển thị (ví dụ: icon button)
Tại sao KHÔNG dùng aria-label khi đã có `<label>`?
- Vì `<label>` đã đủ semantic
- Dùng thêm aria-label có thể gây trùng hoặc rối thông tin

#### Câu A4:
1. loading="lazy" là gì?
- Trì hoãn tải ảnh cho đến khi ảnh gần xuất hiện trong viewport
Cải thiện:
- Tăng tốc độ load trang ban đầu
- Giảm băng thông
- Tốt cho performance (đặc biệt trang nhiều ảnh như e-commerce)
- KHÔNG nên dùng khi:
Ảnh above-the-fold (ảnh đầu trang, banner, hero)
- vì cần hiển thị ngay, không nên delay
2. Tại sao dùng nhiều <source> trong <video>?
- Vì các trình duyệt hỗ trợ format video khác nhau
- Cung cấp nhiều nguồn để đảm bảo video luôn chạy
3. format phổ biến:
- MP4 (video/mp4)
- WebM (video/webm)
- Ogg (video/ogg)
4. Thuộc tính alt dùng để làm gì?
- Mô tả nội dung ảnh cho:
- Screen reader (accessibility)
- Hiển thị khi ảnh lỗi
- Hỗ trợ SEO
- Viết alt cho từng trường hợp:
- Ảnh sản phẩm iPhone 16:
- "iPhone 16 màu đen, góc nhìn mặt trước và sau"
- Ảnh trang trí (decorative):
- "" (alt rỗng)
- Ảnh biểu đồ doanh thu Q1/2026:
- "Biểu đồ doanh thu quý 1 năm 2026, tăng dần từ tháng 1 đến tháng 3"
#### Câu A5:
- Khi dùng Cách 1 (<img>):
- Khi ảnh đứng độc lập, không cần mô tả thêm ngoài alt
Đặc điểm:
Đơn giản, nhẹ
Chỉ mang tính hiển thị
Ví dụ:
Ảnh thumbnail sản phẩm trong danh sách (grid sản phẩm)
Icon/logo nhỏ trong header hoặc footer
- Khi dùng Cách 2 (<figure> + <figcaption>):
- Khi ảnh có chú thích (caption) hoặc cần ngữ nghĩa rõ ràng
Đặc điểm:
Semantic tốt hơn
Caption hiển thị cho người dùng
Tốt cho accessibility & nội dung có ý nghĩa
Ví dụ:
Trang chi tiết sản phẩm (ảnh + tên + giá)
Ảnh minh họa bài blog (kèm mô tả bên dưới)

#### BÀI C1:
- Lỗi 1: Dòng 2 — Input "Tên" không có <label for> (accessibility)
Sửa:
`<label for="name">Tên:</label>`
`<input type="text" id="name" name="name" required>`
- Lỗi 2: Dòng 4 — Input email không có label
Sửa:
`<label for="email">Email:</label>`
`<input type="email" id="email" name="email" required placeholder="Email của bạn">`\
- Lỗi 3: Dòng 6 — Password không có <label>
Sửa:
`<label for="password">Mật khẩu:</label>`
`<input type="password" id="password" name="password" required minlength="8">`
- Lỗi 4: Dòng 7 — Confirm password không có <label>
Sửa:
`<label for="confirm">Nhập lại mật khẩu:</label>`
`<input type="password" id="confirm" name="confirm" required minlength="8">`
- Lỗi 5 (mới): Dòng 9 — Phone dùng sai type (text thay vì tel)
Sửa:
`<label for="phone">Số điện thoại:</label>`
`<input type="tel" id="phone" name="phone" pattern="[0-9]{10}" placeholder="0901234567">`
- Lỗi 6: Dòng 11 — <select> không có <label>
Sửa:
`<label for="city">Thành phố:</label>`
`<select id="city" name="city">`
- Lỗi 7: Dòng 16 — Checkbox thiếu <input>
Sửa:
````<label>
    <input type="checkbox" name="agree" required>
    Tôi đồng ý điều khoản
</label>
````
- Lỗi 8: Dòng 1 — <form> thiếu action và method
Sửa:
`<form action="#" method="POST">`

#### Bài C2:
1. Regex pattern
- CMND/CCCD (12 chữ số):
````
pattern="[0-9]{12}"
````
- Số tài khoản (10–15 chữ số):
````
pattern="[0-9]{10,15}"
````
2. HTML5 validation có đủ an toàn cho ngân hàng không?
Không đủ an toàn
Vì:
- Chỉ chạy ở frontend (trình duyệt)
- Có thể bị bypass (tắt validation, sửa request, dùng tool như Postman)
- Không kiểm soát logic phức tạp hoặc dữ liệu thật
HTML5 chỉ giúp UX, không phải bảo mật
3. 3 loại validation HTML5 KHÔNG làm được
- So sánh giữa nhiều field
Ví dụ: confirm password phải giống password
- Kiểm tra dữ liệu từ server
Email đã tồn tại chưa?
Số tài khoản có hợp lệ trong hệ thống không?
- Logic phức tạp
Ví dụ: kiểm tra CMND theo checksum / thuật toán
Điều kiện phụ thuộc nhiều trường
4. 2 rủi ro nếu chỉ validate frontend
- Bypass validation thì sẽ gửi dữ liệu sai/độc hại
- Hacker có thể gửi request trực tiếp (không qua form)
- Injection / tấn công hệ thống
- Nếu backend không kiểm tra thì dễ bị SQL Injection / dữ liệu rác