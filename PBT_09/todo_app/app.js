const STORAGE_KEY = "pbt09_todos";
const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const countLeft = document.getElementById("countLeft");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompleted");

let todos = [];
let currentFilter = "all";

function loadTodos() {
  const saved = localStorage.getItem(STORAGE_KEY);
  todos = saved ? JSON.parse(saved) : [];
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.dataset.id = todo.id;
  if (todo.completed) {
    li.classList.add("completed");
  }

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = todo.text;
  span.setAttribute("tabindex", "0");
  span.setAttribute("role", "button");
  span.setAttribute("aria-label", "Toggle todo completed");

  const button = document.createElement("button");
  button.className = "delete-btn";
  button.textContent = "❌";
  button.setAttribute("aria-label", "Delete todo");

  li.appendChild(span);
  li.appendChild(button);
  return li;
}

function updateFooter() {
  const activeCount = todos.filter((todo) => !todo.completed).length;
  countLeft.textContent = `${activeCount} item${activeCount === 1 ? "" : "s"} left`;
}

function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }
  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }
  return todos;
}

function renderTodos() {
  todoList.innerHTML = "";
  const filtered = getFilteredTodos();
  const fragment = document.createDocumentFragment();

  filtered.forEach((todo) => {
    fragment.appendChild(createTodoElement(todo));
  });

  todoList.appendChild(fragment);
  updateFooter();
  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === currentFilter);
  });
}

function addTodo(text) {
  todos.unshift({
    id: Date.now(),
    text,
    completed: false,
  });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function editTodo(id, newText) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, text: newText };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    return;
  }
  addTodo(text);
  input.value = "";
  input.focus();
});

todoList.addEventListener("click", (event) => {
  const item = event.target.closest("li");
  if (!item) {
    return;
  }

  const id = Number(item.dataset.id);

  if (event.target.classList.contains("delete-btn")) {
    deleteTodo(id);
    return;
  }

  if (event.target.classList.contains("todo-text")) {
    toggleTodo(id);
  }
});

todoList.addEventListener("dblclick", (event) => {
  if (!event.target.classList.contains("todo-text")) {
    return;
  }

  const item = event.target.closest("li");
  const id = Number(item.dataset.id);
  const originalText = event.target.textContent;

  const editInput = document.createElement("input");
  editInput.className = "edit-input";
  editInput.value = originalText;
  item.replaceChild(editInput, event.target);
  editInput.focus();

  function finishEdit() {
    const value = editInput.value.trim();
    if (value) {
      editTodo(id, value);
    } else {
      editTodo(id, originalText);
    }
  }

  function cancelEdit() {
    renderTodos();
  }

  editInput.addEventListener("keydown", (keyEvent) => {
    if (keyEvent.key === "Enter") {
      finishEdit();
    } else if (keyEvent.key === "Escape") {
      cancelEdit();
    }
  });

  editInput.addEventListener("blur", finishEdit);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTodos();
  });
});

clearCompletedBtn.addEventListener("click", clearCompleted);

window.addEventListener("load", () => {
  loadTodos();
  renderTodos();
});
