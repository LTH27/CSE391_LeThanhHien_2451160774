const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const statusEl = document.getElementById("status");
const weatherResult = document.getElementById("weatherResult");
const historyList = document.getElementById("historyList");

const STORAGE_KEY = "pbt10_weather_history";
let history = [];

function setStatus(message, type = "info") {
  statusEl.textContent = message;
  statusEl.className = "status";
  if (type === "error") {
    statusEl.classList.add("error");
  }
}

function showWeather(data, city) {
  weatherResult.innerHTML = `
    <h2>Thời tiết tại ${city}</h2>
    <div class="weather-grid">
      <div class="weather-item"><strong>Nhiệt độ</strong><p>${data.temperature}°C</p></div>
      <div class="weather-item"><strong>Độ ẩm</strong><p>${data.humidity}%</p></div>
      <div class="weather-item"><strong>Gió</strong><p>${data.windspeed} km/h</p></div>
      <div class="weather-item"><strong>Trạng thái</strong><p>${data.description}</p></div>
    </div>
  `;
  weatherResult.classList.remove("hidden");
}

function hideWeather() {
  weatherResult.classList.add("hidden");
}

function saveHistory(city) {
  history = [city, ...history.filter((item) => item !== city)].slice(0, 5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = "<li>Chưa có lịch sử.</li>";
    return;
  }
  history.forEach((city) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = city;
    button.addEventListener("click", () => {
      cityInput.value = city;
      fetchWeather(city);
    });
    historyList.appendChild(button);
  });
}

async function fetchWeather(city) {
  const query = city.trim();
  if (!query) {
    setStatus("Vui lòng nhập tên thành phố.", "error");
    hideWeather();
    return;
  }

  setStatus("⏳ Đang tải...");
  hideWeather();

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`);
    if (!geoRes.ok) {
      throw new Error(`HTTP ${geoRes.status}`);
    }
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Không tìm thấy thành phố.");
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`);
    if (!weatherRes.ok) {
      throw new Error(`HTTP ${weatherRes.status}`);
    }
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;
    if (!current) {
      throw new Error("Không lấy được dữ liệu thời tiết.");
    }

    const descriptions = {
      0: "Trời quang đãng",
      1: "Nhiều mây",
      2: "Trời nhiều mây",
      3: "Trời có mây",
      45: "Sương mù",
      48: "Sương mù đáy",
      51: "Mưa phùn nhẹ",
      53: "Mưa phùn vừa",
      55: "Mưa phùn dày",
      61: "Mưa nhẹ",
      63: "Mưa vừa",
      65: "Mưa to",
      80: "Mưa rào nhẹ",
      95: "Giông bão",
    };

    showWeather({
      temperature: current.temperature,
      humidity: weatherData.hourly?.relativehumidity_2m?.[0] ?? "—",
      windspeed: current.windspeed,
      description: descriptions[current.weathercode] || "Nhiều mây",
    }, `${name}, ${country}`);
    setStatus("Hiển thị thời tiết thành công.");
    saveHistory(`${name}, ${country}`);
  } catch (error) {
    setStatus(`❌ ${error.message}`, "error");
    hideWeather();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  fetchWeather(cityInput.value);
});

window.addEventListener("load", () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  history = saved ? JSON.parse(saved) : [];
  renderHistory();
});
