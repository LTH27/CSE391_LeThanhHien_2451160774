const images = [
  { title: "Sunset Beach", src: "https://placehold.co/900x520?text=Image+1" },
  { title: "Mountain Path", src: "https://placehold.co/900x520?text=Image+2" },
  { title: "City Lights", src: "https://placehold.co/900x520?text=Image+3" },
  { title: "Forest Trail", src: "https://placehold.co/900x520?text=Image+4" },
  { title: "Desert Dunes", src: "https://placehold.co/900x520?text=Image+5" },
  { title: "Ocean Cliff", src: "https://placehold.co/900x520?text=Image+6" },
  { title: "Snow Peak", src: "https://placehold.co/900x520?text=Image+7" },
  { title: "Lavender Field", src: "https://placehold.co/900x520?text=Image+8" },
  { title: "Starry Night", src: "https://placehold.co/900x520?text=Image+9" },
];

const galleryImage = document.getElementById("galleryImage");
const imageLabel = document.getElementById("imageLabel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const thumbnailList = document.getElementById("thumbnailList");
const overlay = document.getElementById("commandOverlay");
const commandSearch = document.getElementById("commandSearch");
const commandList = document.getElementById("commandList");

const commands = [
  { name: "Next image", action: nextImage },
  { name: "Previous image", action: prevImage },
  { name: "Play slideshow", action: playSlideshow },
  { name: "Pause slideshow", action: pauseSlideshow },
];

const state = {
  index: 0,
  playing: false,
  intervalId: null,
  selectedCommand: 0,
};

function showImage(index) {
  state.index = (index + images.length) % images.length;
  const item = images[state.index];
  galleryImage.src = item.src;
  galleryImage.alt = item.title;
  imageLabel.textContent = `${state.index + 1}. ${item.title}`;
  Array.from(thumbnailList.children).forEach((thumb, idx) => {
    thumb.classList.toggle("active", idx === state.index);
  });
}

function prevImage() {
  showImage(state.index - 1);
}

function nextImage() {
  showImage(state.index + 1);
}

function playSlideshow() {
  if (state.playing) return;
  state.playing = true;
  playPauseBtn.textContent = "Pause";
  state.intervalId = setInterval(() => {
    nextImage();
  }, 2000);
}

function pauseSlideshow() {
  state.playing = false;
  playPauseBtn.textContent = "Play";
  clearInterval(state.intervalId);
}

function createThumbnails() {
  images.forEach((image, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "thumbnail";
    thumb.setAttribute("aria-label", `View ${image.title}`);
    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.title;
    thumb.appendChild(img);
    thumb.addEventListener("click", () => {
      showImage(index);
    });
    thumbnailList.appendChild(thumb);
  });
}

function openCommandPalette() {
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  commandSearch.value = "";
  state.selectedCommand = 0;
  renderCommandList();
  commandSearch.focus();
}

function closeCommandPalette() {
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
}

function renderCommandList() {
  const query = commandSearch.value.toLowerCase();
  commandList.innerHTML = "";
  const filtered = commands.filter((command) =>
    command.name.toLowerCase().includes(query)
  );

  filtered.forEach((command, index) => {
    const item = document.createElement("li");
    item.className = "command-item";
    item.textContent = command.name;
    if (index === state.selectedCommand) {
      item.classList.add("active");
    }
    item.tabIndex = 0;
    item.addEventListener("click", () => {
      command.action();
      closeCommandPalette();
    });
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        command.action();
        closeCommandPalette();
      }
    });
    commandList.appendChild(item);
  });
}

commandSearch.addEventListener("input", () => {
  state.selectedCommand = 0;
  renderCommandList();
});

commandSearch.addEventListener("keydown", (event) => {
  const items = commandList.querySelectorAll(".command-item");
  if (!items.length) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    state.selectedCommand = (state.selectedCommand + 1) % items.length;
    renderCommandList();
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    state.selectedCommand = (state.selectedCommand - 1 + items.length) % items.length;
    renderCommandList();
  }
  if (event.key === "Enter") {
    event.preventDefault();
    items[state.selectedCommand]?.click();
  }
  if (event.key === "Escape") {
    closeCommandPalette();
  }
});

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeCommandPalette();
  }
});

prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);
playPauseBtn.addEventListener("click", () => {
  if (state.playing) {
    pauseSlideshow();
  } else {
    playSlideshow();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCommandPalette();
    return;
  }

  if (overlay.classList.contains("active")) {
    if (event.key === "Escape") {
      closeCommandPalette();
    }
    return;
  }

  if (event.key === "ArrowLeft") {
    prevImage();
  }
  if (event.key === "ArrowRight") {
    nextImage();
  }
  if (event.key === " ") {
    event.preventDefault();
    if (state.playing) {
      pauseSlideshow();
    } else {
      playSlideshow();
    }
  }
  if (/[1-9]/.test(event.key)) {
    const number = Number(event.key);
    if (number <= images.length) {
      showImage(number - 1);
    }
  }
});

createThumbnails();
showImage(0);
renderCommandList();
