const form = document.getElementById("registerForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const confirmInput = document.getElementById("confirmInput");
const phoneInput = document.getElementById("phoneInput");
const submitButton = document.getElementById("submitButton");
const successModal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const okButton = document.getElementById("okButton");
const modalMessage = document.getElementById("modalMessage");

const nameHint = document.getElementById("nameHint");
const emailHint = document.getElementById("emailHint");
const passwordHint = document.getElementById("passwordHint");
const confirmHint = document.getElementById("confirmHint");
const phoneHint = document.getElementById("phoneHint");
const strengthFill = document.getElementById("strengthFill");

const state = {
  nameValid: false,
  emailValid: false,
  passwordScore: 0,
  confirmValid: false,
  phoneValid: false,
};

function setHint(element, message, valid) {
  element.textContent = message;
  element.style.color = valid ? "#16a34a" : "#dc2626";
}

function validateName() {
  const value = nameInput.value.trim();
  const valid = value.length >= 2 && value.length <= 50;
  state.nameValid = valid;
  setHint(nameHint, valid ? "Tên hợp lệ." : "Tên cần 2-50 ký tự.", valid);
}

function validateEmail() {
  const value = emailInput.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = regex.test(value);
  state.emailValid = valid;
  setHint(emailHint, valid ? "Email hợp lệ." : "Email không đúng định dạng.", valid);
}

function calculatePasswordScore(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function validatePassword() {
  const value = passwordInput.value;
  const score = calculatePasswordScore(value);
  state.passwordScore = score;
  const percent = Math.min((score / 4) * 100, 100);
  strengthFill.style.width = `${percent}%`;

  if (score <= 1) {
    strengthFill.style.background = "#dc2626";
    setHint(passwordHint, "Mật khẩu yếu: cần ít nhất 8 ký tự.", false);
  } else if (score === 2 || score === 3) {
    strengthFill.style.background = "#f59e0b";
    setHint(passwordHint, "Mật khẩu trung bình: nên có chữ hoa, số và ký tự đặc biệt.", false);
  } else {
    strengthFill.style.background = "#16a34a";
    setHint(passwordHint, "Mật khẩu mạnh.", true);
  }
}

function validateConfirm() {
  const password = passwordInput.value;
  const confirm = confirmInput.value;
  const valid = password === confirm && confirm.length > 0;
  state.confirmValid = valid;
  setHint(confirmHint, valid ? "Mật khẩu khớp." : "Mật khẩu chưa khớp.", valid);
}

function formatPhoneValue(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const parts = [];
  if (digits.length >= 4) {
    parts.push(digits.slice(0, 4));
    if (digits.length >= 7) {
      parts.push(digits.slice(4, 7));
      parts.push(digits.slice(7));
    } else {
      parts.push(digits.slice(4));
    }
  } else {
    parts.push(digits);
  }
  return parts.filter(Boolean).join("-");
}

function validatePhone() {
  const formatted = formatPhoneValue(phoneInput.value);
  phoneInput.value = formatted;
  const valid = /^\d{4}-\d{3}-\d{3}$/.test(formatted);
  state.phoneValid = valid;
  setHint(phoneHint, valid ? "Số điện thoại hợp lệ." : "Nhập 10 chữ số định dạng 0901-234-567.", valid);
}

function updateSubmitState() {
  const canSubmit = state.nameValid && state.emailValid && state.passwordScore >= 4 && state.confirmValid && state.phoneValid;
  submitButton.disabled = !canSubmit;
}

nameInput.addEventListener("input", () => {
  validateName();
  updateSubmitState();
});

emailInput.addEventListener("input", () => {
  validateEmail();
  updateSubmitState();
});

passwordInput.addEventListener("input", () => {
  validatePassword();
  validateConfirm();
  updateSubmitState();
});

confirmInput.addEventListener("input", () => {
  validateConfirm();
  updateSubmitState();
});

phoneInput.addEventListener("input", () => {
  validatePhone();
  updateSubmitState();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  modalMessage.textContent = `Xin chúc mừng ${nameInput.value.trim()}! Email: ${emailInput.value.trim()} - Số điện thoại: ${phoneInput.value}.`;
  successModal.classList.add("active");
});

function closeSuccessModal() {
  successModal.classList.remove("active");
}

closeModal.addEventListener("click", closeSuccessModal);
okButton.addEventListener("click", closeSuccessModal);
successModal.addEventListener("click", (event) => {
  if (event.target === successModal) {
    closeSuccessModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSuccessModal();
  }
});

validateName();
validateEmail();
validatePassword();
validateConfirm();
validatePhone();
updateSubmitState();
