// ============================================================
//  Quản Lý Công Việc – main.js
//  DOM, Events, CRUD, localStorage
// ============================================================

// -------- Dữ liệu --------
let tasks = [];       // mảng công việc
let editingId = null; // null = thêm mới | string = đang sửa

// -------- Lấy phần tử DOM --------
const btnOpenForm    = document.getElementById('btnOpenForm');
const btnCloseForm   = document.getElementById('btnCloseForm');
const btnCancel      = document.getElementById('btnCancel');
const modalOverlay   = document.getElementById('modalOverlay');
const taskForm       = document.getElementById('taskForm');
const modalTitle     = document.getElementById('modalTitle');
const btnSubmit      = document.getElementById('btnSubmit');
const taskList       = document.getElementById('taskList');
const emptyState     = document.getElementById('emptyState');
const toastContainer = document.getElementById('toastContainer');

// Thống kê
const totalEl   = document.getElementById('totalTasks');
const doneEl    = document.getElementById('doneTasks');
const pendingEl = document.getElementById('pendingTasks');

// Input fields
const inp = {
  tieuDe:        document.getElementById('tieuDe'),
  moTa:          document.getElementById('moTa'),
  hanHoanThanh:  document.getElementById('hanHoanThanh'),
  mucUuTien:     document.getElementById('mucUuTien'),
};

// -------- localStorage --------
function loadTasks() {
  const raw = localStorage.getItem('tasks_data');
  tasks = raw ? JSON.parse(raw) : [];
}

function saveTasks() {
  localStorage.setItem('tasks_data', JSON.stringify(tasks));
}

// -------- Render danh sách --------
function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.classList.add('visible');
    return;
  }
  emptyState.classList.remove('visible');

  tasks.forEach(task => {
    const card = createTaskCard(task);
    taskList.appendChild(card);
  });
}

function createTaskCard(task) {
  const div = document.createElement('div');
  div.className = 'task-card' + (task.done ? ' done' : '');
  div.dataset.id = task.id;

  const isOverdue = !task.done && isTaskOverdue(task.hanHoanThanh);

  div.innerHTML = `
    <div class="task-checkbox-wrap">
      <button class="task-checkbox btn-toggle" data-id="${task.id}" title="Đổi trạng thái">
        ${task.done ? '✓' : ''}
      </button>
    </div>
    <div class="task-body">
      <div class="task-title">${escapeHtml(task.tieuDe)}</div>
      ${task.moTa ? `<div class="task-desc">${escapeHtml(task.moTa)}</div>` : ''}
      <div class="task-meta">
        <span class="badge badge-priority-${task.mucUuTien}">
          ${priorityLabel(task.mucUuTien)}
        </span>
        <span class="badge badge-deadline ${isOverdue ? 'overdue' : ''}">
          📅 ${formatDate(task.hanHoanThanh)}${isOverdue ? ' ⚠ Quá hạn' : ''}
        </span>
        <span class="badge ${task.done ? 'badge-status-done' : 'badge-status-pending'}">
          ${task.done ? '✅ Hoàn thành' : '🔵 Chưa xong'}
        </span>
      </div>
    </div>
    <div class="task-actions">
      <button class="btn-edit"   data-id="${task.id}">✏️ Sửa</button>
      <button class="btn-delete" data-id="${task.id}">🗑 Xóa</button>
    </div>
  `;
  return div;
}

// -------- Cập nhật thống kê --------
function updateTaskSummary() {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const pending = total - done;

  totalEl.textContent   = total;
  doneEl.textContent    = done;
  pendingEl.textContent = pending;
}

// -------- Event delegation trên taskList --------
taskList.addEventListener('click', function(e) {
  const toggleBtn = e.target.closest('.btn-toggle');
  const editBtn   = e.target.closest('.btn-edit');
  const deleteBtn = e.target.closest('.btn-delete');

  if (toggleBtn) toggleDone(toggleBtn.dataset.id);
  if (editBtn)   openEditForm(editBtn.dataset.id);
  if (deleteBtn) confirmDelete(deleteBtn.dataset.id);
});

// -------- Đổi trạng thái hoàn thành --------
function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.done = !task.done;
  saveTasks();
  renderTasks();
  updateTaskSummary();

  showMessage(
    task.done
      ? `✅ Đã đánh dấu hoàn thành: "${task.tieuDe}"`
      : `🔄 Đã chuyển về chưa hoàn thành: "${task.tieuDe}"`,
    task.done ? 'success' : 'info'
  );
}

// -------- Mở form --------
function openAddForm() {
  editingId = null;
  resetForm();
  modalTitle.textContent = '➕ Thêm Công Việc';
  btnSubmit.textContent  = '💾 Lưu';
  showModal();
}

function openEditForm(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  editingId = id;
  inp.tieuDe.value       = task.tieuDe;
  inp.moTa.value         = task.moTa || '';
  inp.hanHoanThanh.value = task.hanHoanThanh;
  inp.mucUuTien.value    = task.mucUuTien;

  clearErrors();
  modalTitle.textContent = '✏️ Cập Nhật Công Việc';
  btnSubmit.textContent  = '✔ Cập nhật';
  showModal();
}

function showModal()  { modalOverlay.classList.add('active'); }
function closeModal() { modalOverlay.classList.remove('active'); resetForm(); }

// -------- Reset form --------
function resetForm() {
  taskForm.reset();
  editingId = null;
  clearErrors();
}

function clearErrors() {
  ['tieuDe', 'hanHoanThanh', 'mucUuTien'].forEach(key => {
    const errEl = document.getElementById('err-' + key);
    if (errEl) errEl.textContent = '';
    inp[key].classList.remove('invalid');
  });
}

// -------- Validate --------
function validateForm() {
  clearErrors();
  let valid = true;

  function err(field, msg) {
    const errEl = document.getElementById('err-' + field);
    if (errEl) errEl.textContent = msg;
    inp[field].classList.add('invalid');
    valid = false;
  }

  if (!inp.tieuDe.value.trim())       err('tieuDe',       'Vui lòng nhập tiêu đề công việc.');
  if (!inp.hanHoanThanh.value)        err('hanHoanThanh', 'Vui lòng chọn hạn hoàn thành.');
  if (!inp.mucUuTien.value)           err('mucUuTien',    'Vui lòng chọn mức ưu tiên.');

  return valid;
}

// -------- CRUD --------
function addTask(data) {
  tasks.push({ ...data, id: generateId(), done: false });
  saveTasks();
  renderTasks();
  updateTaskSummary();
  showMessage('Đã thêm công việc thành công! 🎉', 'success');
  closeModal();
}

function updateTask(data) {
  const idx = tasks.findIndex(t => t.id === editingId);
  if (idx === -1) return;
  tasks[idx] = { ...tasks[idx], ...data };
  saveTasks();
  renderTasks();
  updateTaskSummary();
  showMessage('Đã cập nhật công việc thành công! ✅', 'success');
  closeModal();
}

function confirmDelete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  if (confirm(`Bạn có chắc muốn xóa công việc "${task.tieuDe}"?`)) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateTaskSummary();
    showMessage(`Đã xóa: "${task.tieuDe}"`, 'error');
  }
}

// -------- Lấy dữ liệu từ form --------
function getFormData() {
  return {
    tieuDe:       inp.tieuDe.value.trim(),
    moTa:         inp.moTa.value.trim(),
    hanHoanThanh: inp.hanHoanThanh.value,
    mucUuTien:    inp.mucUuTien.value,
  };
}

// -------- Sự kiện submit form --------
taskForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const data = getFormData();
  if (editingId) {
    updateTask(data);
  } else {
    addTask(data);
  }
});

// -------- Sự kiện mở / đóng modal --------
btnOpenForm.addEventListener('click', openAddForm);
btnCloseForm.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
});

// -------- Toast / thông báo --------
function showMessage(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: '✅', error: '🗑', info: '🔄' };
  toast.innerHTML = `<span>${icons[type] || '✅'}</span> ${msg}`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// -------- Helpers --------
function generateId() {
  return 'task_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
}

function formatDate(str) {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

function isTaskOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

function priorityLabel(val) {
  const map = { 'cao': '🔴 Cao', 'trung-binh': '🟡 Trung bình', 'thap': '🟢 Thấp' };
  return map[val] || val;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// -------- Khởi động --------
(function init() {
  loadTasks();
  renderTasks();
  updateTaskSummary();
})();
