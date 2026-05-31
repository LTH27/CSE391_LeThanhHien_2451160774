# Reflection

1. Ở Phần A, mỗi lần thêm/xóa/toggle một todo, mình phải gọi các hàm sau:
   - `addTodo()` khi thêm todo
   - `toggleTodo(id)` khi thay đổi trạng thái done của todo
   - `deleteTodo(id)` khi xóa todo
   - `renderTodos()` sau mỗi thay đổi để cập nhật DOM

2. Ở Phần B, khi `setTodos(...)` chạy, React tự động tính toán thay đổi và cập nhật lại UI. React sẽ so sánh virtual DOM với DOM thực, rồi chỉ render lại những phần cần thay đổi, nên mình không cần thao tác DOM thủ công.

3. Nếu Portfolio có 50 project, quản lý danh sách theo state (React) sẽ an toàn hơn. Bởi vì data được lưu trong state và UI được render lại tự động, mình không phải lo bị trạng thái DOM bị sai lệch hoặc quên cập nhật khi thay đổi data.

4. Khi `ProjectCard` thay cho `TodoItem`, mình vẫn dùng cùng pattern: lưu mảng project trong `useState`, dùng `.map()` để render mỗi project ra component, dùng `.filter()` để lọc category. Nếu thêm xóa project, chỉ cần cập nhật state bằng `setProjects(newArray)` và React sẽ render lại danh sách đúng.
