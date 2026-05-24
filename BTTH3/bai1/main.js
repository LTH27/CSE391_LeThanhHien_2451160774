// ============================================================
//  Quản Lý Sinh Viên – main.js
//  DOM, Events, CRUD, localStorage
// ============================================================

// -------- Dữ liệu --------
let students = [];          // mảng sinh viên hiện tại
let editingId = null;       // null = thêm mới | string = đang sửa

// -------- Lấy phần tử DOM --------
const btnOpenForm    = document.getElementById('btnOpenForm');
const btnCloseForm   = document.getElementById('btnCloseForm');
const btnCancel      = document.getElementById('btnCancel');
const modalOverlay   = document.getElementById('modalOverlay');
const studentForm    = document.getElementById('studentForm');
const modalTitle     = document.getElementById('modalTitle');
const btnSubmit      = document.getElementById('btnSubmit');
const tableBody      = document.getElementById('studentTableBody');
const emptyState     = document.getElementById('emptyState');
const totalEl        = document.getElementById('totalStudents');
const avgEl          = document.getElementById('avgScore');
const topEl          = document.getElementById('topScore');
const toastContainer = document.getElementById('toastContainer');

// Input fields
const inp = {
  maSV:     document.getElementById('maSV'),
  hoTen:    document.getElementById('hoTen'),
  ngaySinh: document.getElementById('ngaySinh'),
  lopHoc:   document.getElementById('lopHoc'),
  diemTB:   document.getElementById('diemTB'),
  email:    document.getElementById('email'),
};

// -------- localStorage --------
function loadStudents() {
  const raw = localStorage.getItem('students_data');
  students = raw ? JSON.parse(raw) : [];
}

function saveStudents() {
  localStorage.setItem('students_data', JSON.stringify(students));
}

// -------- Render bảng --------
function renderStudents() {
  tableBody.innerHTML = '';

  if (students.length === 0) {
    emptyState.classList.add('visible');
    return;
  }
  emptyState.classList.remove('visible');

  students.forEach((sv, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${sv.maSV}</strong></td>
      <td>${sv.hoTen}</td>
      <td>${formatDate(sv.ngaySinh)}</td>
      <td>${sv.lopHoc}</td>
      <td>${scoreBadge(sv.diemTB)}</td>
      <td><a href="mailto:${sv.email}" style="color:var(--accent2)">${sv.email}</a></td>
      <td>
        <div class="action-btns">
          <button class="btn-edit"   data-id="${sv.id}">✏️ Sửa</button>
          <button class="btn-delete" data-id="${sv.id}">🗑 Xóa</button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Gắn sự kiện cho nút Sửa / Xóa (event delegation)
  tableBody.addEventListener('click', handleTableClick);
}

// Chỉ gắn một lần (event delegation tránh duplicate)
let delegated = false;
function setupTableDelegation() {
  if (delegated) return;
  delegated = true;
  tableBody.addEventListener('click', handleTableClick);
}

function handleTableClick(e) {
  const editBtn   = e.target.closest('.btn-edit');
  const deleteBtn = e.target.closest('.btn-delete');
  if (editBtn)   openEditForm(editBtn.dataset.id);
  if (deleteBtn) confirmDelete(deleteBtn.dataset.id);
}

// -------- Cập nhật thống kê --------
function updateStatistics() {
  totalEl.textContent = students.length;

  if (students.length === 0) {
    avgEl.textContent = '0.00';
    topEl.textContent = '—';
    return;
  }
  const scores = students.map(sv => parseFloat(sv.diemTB));
  const avg    = scores.reduce((a, b) => a + b, 0) / scores.length;
  const top    = Math.max(...scores);
  avgEl.textContent = avg.toFixed(2);
  topEl.textContent = top.toFixed(2);
}

// -------- Mở / đóng form --------
function openAddForm() {
  editingId = null;
  resetForm();
  modalTitle.textContent = 'Thêm Sinh Viên';
  btnSubmit.textContent  = '💾 Lưu';
  showModal();
}

function openEditForm(id) {
  const sv = students.find(s => s.id === id);
  if (!sv) return;

  editingId = id;
  inp.maSV.value     = sv.maSV;
  inp.hoTen.value    = sv.hoTen;
  inp.ngaySinh.value = sv.ngaySinh;
  inp.lopHoc.value   = sv.lopHoc;
  inp.diemTB.value   = sv.diemTB;
  inp.email.value    = sv.email;

  clearErrors();
  modalTitle.textContent = '✏️ Cập Nhật Sinh Viên';
  btnSubmit.textContent  = '✔ Cập nhật';
  showModal();
}

function showModal()  { modalOverlay.classList.add('active'); }
function closeModal() { modalOverlay.classList.remove('active'); resetForm(); }

// -------- Reset form --------
function resetForm() {
  studentForm.reset();
  editingId = null;
  clearErrors();
}

function clearErrors() {
  ['maSV','hoTen','ngaySinh','lopHoc','diemTB','email'].forEach(key => {
    document.getElementById('err-' + key).textContent = '';
    inp[key].classList.remove('invalid');
  });
}

// -------- Validate --------
function validateForm() {
  clearErrors();
  let valid = true;

  function err(field, msg) {
    document.getElementById('err-' + field).textContent = msg;
    inp[field].classList.add('invalid');
    valid = false;
  }

  if (!inp.maSV.value.trim())     err('maSV',     'Vui lòng nhập mã sinh viên.');
  if (!inp.hoTen.value.trim())    err('hoTen',    'Vui lòng nhập họ và tên.');
  if (!inp.ngaySinh.value)        err('ngaySinh', 'Vui lòng chọn ngày sinh.');
  if (!inp.lopHoc.value.trim())   err('lopHoc',   'Vui lòng nhập lớp học.');

  const diem = parseFloat(inp.diemTB.value);
  if (inp.diemTB.value === '' || isNaN(diem))
    err('diemTB', 'Vui lòng nhập điểm trung bình.');
  else if (diem < 0 || diem > 10)
    err('diemTB', 'Điểm phải nằm trong khoảng 0 – 10.');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!inp.email.value.trim())
    err('email', 'Vui lòng nhập email.');
  else if (!emailRegex.test(inp.email.value.trim()))
    err('email', 'Email không đúng định dạng.');

  return valid;
}

// -------- CRUD --------
function addStudent(data) {
  students.push({ ...data, id: generateId() });
  saveStudents();
  renderStudents();
  updateStatistics();
  showToast('Đã thêm sinh viên thành công! 🎉', 'success');
  closeModal();
}

function updateStudent(data) {
  const idx = students.findIndex(sv => sv.id === editingId);
  if (idx === -1) return;
  students[idx] = { ...students[idx], ...data };
  saveStudents();
  renderStudents();
  updateStatistics();
  showToast('Đã cập nhật sinh viên thành công! ✅', 'success');
  closeModal();
}

function confirmDelete(id) {
  const sv = students.find(s => s.id === id);
  if (!sv) return;
  if (confirm(`Bạn có chắc muốn xóa sinh viên "${sv.hoTen}" (${sv.maSV})?`)) {
    students = students.filter(s => s.id !== id);
    saveStudents();
    renderStudents();
    updateStatistics();
    showToast(`Đã xóa sinh viên ${sv.hoTen}.`, 'error');
  }
}

// -------- Lấy dữ liệu từ form --------
function getFormData() {
  return {
    maSV:     inp.maSV.value.trim(),
    hoTen:    inp.hoTen.value.trim(),
    ngaySinh: inp.ngaySinh.value,
    lopHoc:   inp.lopHoc.value.trim(),
    diemTB:   parseFloat(inp.diemTB.value),
    email:    inp.email.value.trim(),
  };
}

// -------- Sự kiện submit form --------
studentForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const data = getFormData();
  if (editingId) {
    updateStudent(data);
  } else {
    addStudent(data);
  }
});

// -------- Sự kiện mở / đóng modal --------
btnOpenForm.addEventListener('click', openAddForm);
btnCloseForm.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);

// Đóng modal khi click ra ngoài
modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) closeModal();
});

// Đóng modal bằng Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
});

// -------- Toast thông báo --------
function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : '🗑'}</span> ${msg}`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// -------- Helpers --------
function generateId() {
  return 'sv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

function formatDate(str) {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

function scoreBadge(score) {
  const s = parseFloat(score);
  let cls = 'score-weak';
  if (s >= 8.5) cls = 'score-excellent';
  else if (s >= 7)   cls = 'score-good';
  else if (s >= 5)   cls = 'score-average';
  return `<span class="score-badge ${cls}">${s.toFixed(2)}</span>`;
}

// -------- Khởi động --------
(function init() {
  setupTableDelegation();
  loadStudents();
  renderStudents();
  updateStatistics();
})();
