const refreshBtn = document.getElementById("refreshBtn");
const timeInfo = document.getElementById("timeInfo");
const usersWidget = document.getElementById("usersWidget");
const dogsWidget = document.getElementById("dogsWidget");
const countryWidget = document.getElementById("countryWidget");

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return await res.json();
}

function showLoading(widget) {
  widget.className = "widget-body loading";
  widget.textContent = "Loading...";
}

function showError(widget, message) {
  widget.className = "widget-body error";
  widget.textContent = message;
}

function renderUsers(data) {
  const list = document.createElement("ul");
  list.className = "user-list";
  data.results.slice(0, 4).forEach((user) => {
    const item = document.createElement("li");
    item.className = "user-item";
    item.innerHTML = `<strong>${user.name.first} ${user.name.last}</strong><p>${user.email}</p>`;
    list.appendChild(item);
  });
  usersWidget.innerHTML = "";
  usersWidget.appendChild(list);
}

function renderDogs(data) {
  const list = document.createElement("div");
  list.className = "dog-list";
  data.message.slice(0, 4).forEach((src) => {
    const item = document.createElement("div");
    item.className = "dog-item";
    item.innerHTML = `<img src="${src}" alt="Dog image"><p>Dog photo</p>`;
    list.appendChild(item);
  });
  dogsWidget.innerHTML = "";
  dogsWidget.appendChild(list);
}

function renderCountry(data) {
  const item = document.createElement("div");
  item.className = "country-item";
  item.innerHTML = `
    <strong>${data[0].name.common}</strong>
    <p>Region: ${data[0].region}</p>
    <p>Capital: ${data[0].capital?.[0] || "-"}</p>
    <p>Population: ${data[0].population.toLocaleString()}</p>
  `;
  countryWidget.innerHTML = "";
  countryWidget.appendChild(item);
}

async function loadDashboard() {
  const startTime = Date.now();
  showLoading(usersWidget);
  showLoading(dogsWidget);
  showLoading(countryWidget);
  timeInfo.textContent = "Đang tải dữ liệu...";

  const promises = [
    fetchJson("https://randomuser.me/api/?results=4"),
    fetchJson("https://dog.ceo/api/breeds/image/random/4"),
    fetchJson("https://restcountries.com/v3.1/name/vietnam"),
  ];

  const results = await Promise.allSettled(promises);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      if (index === 0) renderUsers(result.value);
      if (index === 1) renderDogs(result.value);
      if (index === 2) renderCountry(result.value);
    } else {
      const message = `Lỗi API: ${result.reason.message}`;
      if (index === 0) showError(usersWidget, message);
      if (index === 1) showError(dogsWidget, message);
      if (index === 2) showError(countryWidget, message);
    }
  });

  const duration = Date.now() - startTime;
  timeInfo.textContent = `Loaded in ${duration} ms`;
}

refreshBtn.addEventListener("click", loadDashboard);
window.addEventListener("load", loadDashboard);
