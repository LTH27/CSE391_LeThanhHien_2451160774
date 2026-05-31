const api = {
  baseURL: "https://jsonplaceholder.typicode.com",
  async getUsers() {
    const res = await fetch(`${this.baseURL}/users`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },
  async getUser(id) {
    const res = await fetch(`${this.baseURL}/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },
  async createUser(data) {
    const res = await fetch(`${this.baseURL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },
  async updateUser(id, data) {
    const res = await fetch(`${this.baseURL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },
  async deleteUser(id) {
    const res = await fetch(`${this.baseURL}/users/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  },
};

const ui = {
  userCards: document.getElementById("userCards"),
  loading: document.getElementById("loading"),
  alert: document.getElementById("alert"),
  formSection: document.getElementById("formSection"),
  formTitle: document.getElementById("formTitle"),
  userForm: document.getElementById("userForm"),
  searchInput: document.getElementById("searchInput"),
  newUserBtn: document.getElementById("newUserBtn"),
  nameInput: document.getElementById("name"),
  emailInput: document.getElementById("email"),
  phoneInput: document.getElementById("phone"),
  websiteInput: document.getElementById("website"),
  cancelBtn: document.getElementById("cancelBtn"),
  showLoading() {
    this.loading.style.display = "block";
  },
  hideLoading() {
    this.loading.style.display = "none";
  },
  showError(message) {
    this.alert.textContent = message;
    this.alert.className = "alert error";
    this.alert.style.display = "block";
  },
  showSuccess(message) {
    this.alert.textContent = message;
    this.alert.className = "alert";
    this.alert.style.display = "block";
  },
  clearAlert() {
    this.alert.style.display = "none";
  },
  renderUsers(users) {
    this.userCards.innerHTML = "";
    users.forEach((user) => {
      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Website:</strong> ${user.website || "-"}</p>
        <div class="card-actions">
          <button class="action-btn edit-btn" data-id="${user.id}">Edit</button>
          <button class="action-btn delete-btn" data-id="${user.id}">Delete</button>
        </div>
      `;
      this.userCards.appendChild(card);
    });
  },
  setFormData(user) {
    this.nameInput.value = user.name || "";
    this.emailInput.value = user.email || "";
    this.phoneInput.value = user.phone || "";
    this.websiteInput.value = user.website || "";
  },
};

let users = [];
let editingUserId = null;

async function loadUsers() {
  ui.clearAlert();
  ui.showLoading();
  try {
    users = await api.getUsers();
    renderUserList();
  } catch (error) {
    ui.showError(`Lỗi tải users: ${error.message}`);
  } finally {
    ui.hideLoading();
  }
}

function renderUserList() {
  const query = ui.searchInput.value.trim().toLowerCase();
  const filtered = users.filter((user) => {
    return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
  });
  ui.renderUsers(filtered);
}

function openForm(editUser = null) {
  ui.formSection.classList.remove("hidden");
  if (editUser) {
    editingUserId = editUser.id;
    ui.formTitle.textContent = "Chỉnh sửa user";
    ui.setFormData(editUser);
  } else {
    editingUserId = null;
    ui.formTitle.textContent = "Thêm user";
    ui.userForm.reset();
  }
}

function closeForm() {
  ui.formSection.classList.add("hidden");
  ui.userForm.reset();
  editingUserId = null;
}

ui.newUserBtn.addEventListener("click", () => openForm());
ui.cancelBtn.addEventListener("click", () => closeForm());
ui.searchInput.addEventListener("input", renderUserList);

ui.userCards.addEventListener("click", async (event) => {
  const id = event.target.dataset.id;
  if (!id) return;
  const userId = Number(id);

  if (event.target.classList.contains("edit-btn")) {
    const user = users.find((item) => item.id === userId);
    if (user) openForm(user);
    return;
  }

  if (event.target.classList.contains("delete-btn")) {
    const confirmed = confirm("Bạn có chắc muốn xóa user này?");
    if (!confirmed) return;
    try {
      await api.deleteUser(userId);
      users = users.filter((item) => item.id !== userId);
      renderUserList();
      ui.showSuccess("Xóa user thành công.");
    } catch (error) {
      ui.showError(`Xóa thất bại: ${error.message}`);
    }
  }
});

ui.userForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = {
    name: ui.nameInput.value.trim(),
    email: ui.emailInput.value.trim(),
    phone: ui.phoneInput.value.trim(),
    website: ui.websiteInput.value.trim(),
  };

  if (editingUserId) {
    try {
      const updated = await api.updateUser(editingUserId, data);
      users = users.map((user) => (user.id === editingUserId ? updated : user));
      renderUserList();
      ui.showSuccess("Cập nhật user thành công.");
      closeForm();
    } catch (error) {
      ui.showError(`Cập nhật thất bại: ${error.message}`);
    }
  } else {
    try {
      const created = await api.createUser(data);
      users.unshift(created);
      renderUserList();
      ui.showSuccess("Thêm user thành công.");
      closeForm();
    } catch (error) {
      ui.showError(`Tạo user thất bại: ${error.message}`);
    }
  }
});

window.addEventListener("load", loadUsers);
