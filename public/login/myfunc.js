//===========
window.addEventListener('DOMContentLoaded', () => {
setTimeout(() => {
const splash = document.getElementById('splashScreen');
const main = document.getElementById('mainContent');
splash.classList.add('fade-out');
setTimeout(() => {
splash.remove();
main.classList.remove('hidden');
}, 400);
}, 800); 
});
//===========
const form = document.getElementById("admin-login-form");
const emailInput = form.email;
const passwordInput = form.password;
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
form.addEventListener("submit", async (e) => {
e.preventDefault();
let valid = true;
if (!emailInput.value) {
emailError.classList.remove("hidden");
valid = false;
} else {
emailError.classList.add("hidden");
}
if (!passwordInput.value) {
passwordError.classList.remove("hidden");
valid = false;
} else {
passwordError.classList.add("hidden");
}
if (!valid) return;
try {
const res = await fetch("/api/auth", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
email: emailInput.value,
password: passwordInput.value
}),
});
const result = await res.json();
if (result.success) {
window.location.href = "/dashboard";
} else {
showToast(result.message || "Login failed.");
}
} catch (err) {
showToast("Terjadi kesalahan, silakan coba lagi.");
console.error(err);
}
});
const togglePassword = document.getElementById('toggle-password');
const passwordField = document.getElementById('admin-password');
togglePassword.addEventListener('click', () => {
const isPassword = passwordField.type === 'password';
passwordField.type = isPassword ? 'text' : 'password';
togglePassword.innerHTML = isPassword 
? '<i class="fas fa-eye-slash"></i>' 
: '<i class="fas fa-eye"></i>';
});
//===========
function showToast(message) {
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
toastMessage.textContent = message;
toast.classList.remove('opacity-0', 'pointer-events-none');
toast.classList.add('opacity-100');
setTimeout(() => {
toast.classList.remove('opacity-100');
toast.classList.add('opacity-0', 'pointer-events-none');
}, 1500);
}