const photoGrid = document.getElementById("photoGrid");
const loader = document.getElementById("loader");
const loadTrigger = document.getElementById("loadTrigger");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const closeLightbox = document.getElementById("closeLightbox");

let page = 1;
const limit = 20;
let loading = false;
let allLoaded = false;

const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !loading && !allLoaded) {
    loadMorePhotos();
  }
}, {
  rootMargin: "200px",
});

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute("data-src");
    }
    imageObserver.unobserve(img);
  });
}, {
  rootMargin: "100px",
  threshold: 0.1,
});

function createPhotoCard(photo) {
  const card = document.createElement("article");
  card.className = "photo-card";
  card.tabIndex = 0;
  card.innerHTML = `
    <img data-src="${photo.url}" alt="${photo.title}">
    <span>${photo.title}</span>
  `;

  const img = card.querySelector("img");
  imageObserver.observe(img);
  card.addEventListener("click", () => openLightbox(photo));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter") openLightbox(photo);
  });
  return card;
}

function renderPhotos(photos) {
  photos.forEach((photo) => {
    photoGrid.appendChild(createPhotoCard(photo));
  });
}

async function loadMorePhotos() {
  loading = true;
  loader.textContent = "Đang tải thêm ảnh...";
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${limit}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const photos = await res.json();
    if (photos.length === 0) {
      allLoaded = true;
      loader.textContent = "Đã tải hết ảnh.";
      observer.unobserve(loadTrigger);
      return;
    }
    renderPhotos(photos);
    page += 1;
  } catch (error) {
    loader.textContent = `Lỗi tải ảnh: ${error.message}`;
  } finally {
    loading = false;
  }
}

function openLightbox(photo) {
  lightboxImage.src = photo.url;
  lightboxImage.alt = photo.title;
  lightboxTitle.textContent = photo.title;
  lightbox.classList.remove("hidden");
}

function closeLightboxPanel() {
  lightbox.classList.add("hidden");
}

closeLightbox.addEventListener("click", closeLightboxPanel);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightboxPanel();
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightboxPanel();
  }
});

observer.observe(loadTrigger);
loadMorePhotos();
