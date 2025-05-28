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
async function getApiKey() {
try {
const res = await fetch('/api/cekapikey');
const data = await res.json();
const textarea = document.getElementById('userApiKey');

if (res.ok && data.apikey) {
textarea.value = data.apikey;
} else {
textarea.value = "API Key tidak tersedia.";
}
} catch (err) {
console.error("Gagal memuat API Key:", err);
document.getElementById('userApiKey').value = "Gagal memuat API Key.";
}
}
//===========
function copyToClipboard(id) {
const el = document.getElementById(id);
const button = event.target; 
const text = el.value;
if (navigator.clipboard) {
navigator.clipboard.writeText(text)
.then(() => {
button.textContent = 'Copied!';
setTimeout(() => (button.textContent = 'Copy'), 1500);
})
.catch(err => {
console.error("Gagal menyalin:", err);
alert("Gagal menyalin teks.");
});
} else {
el.select();
document.execCommand("copy");
button.textContent = 'Copied!';
setTimeout(() => (button.textContent = 'Copy'), 1500);
}
}
window.addEventListener('DOMContentLoaded', getApiKey);
let menuVisible = false;
function toggleMenu() {
const menu = document.getElementById('mobileMenu');
const toggleBtn = document.getElementById('menuToggle');
if (!menuVisible) {
menu.style.display = 'block';
menu.style.animation = 'slideIn 0.3s ease-in-out';
menuVisible = true;
setTimeout(() => {
document.addEventListener('click', outsideClickListener);
}, 350);
} else {
hideMenu();
}
}
function hideMenu() {
const menu = document.getElementById('mobileMenu');
menu.style.animation = 'slideOut 0.3s ease-in-out';
setTimeout(() => {
menu.style.display = 'none';
menuVisible = false;
}, 300);
document.removeEventListener('click', outsideClickListener);
}
function outsideClickListener(event) {
const menu = document.getElementById('mobileMenu');
const toggleBtn = document.getElementById('menuToggle');

if (
menuVisible &&
!menu.contains(event.target) &&
event.target !== toggleBtn
) {
hideMenu();
}
}
//=========
document.getElementById("logout-button-1").addEventListener("click", async () => {
try {
const res = await fetch("/api/logout", {
method: "POST",
credentials: "same-origin"
});
if (res.redirected) {
setTimeout(() => {
window.location.href = res.url;
}, 350); 
} else {
alert("Logout gagal atau tidak ada redirect");
}
} catch (err) {
console.error("Logout error:", err);
}
});
//=========
window.addEventListener("DOMContentLoaded", async () => {
try {
const res = await fetch('/api/auth/info'); 
const data = await res.json();
if (data.role !== 'owner') {
const adminWrapper = document.getElementById('adminControlWrapper');
if (adminWrapper) adminWrapper.style.display = 'none';
const adminBtn = document.getElementById('cekownwa');
if (adminBtn) adminBtn.style.display = 'none';
}
} catch (err) {
console.error("Gagal ambil info user:", err);
}
});
//=========
document.addEventListener('DOMContentLoaded', () => {
const path = window.location.pathname.replace(/\/$/, '');
document.querySelectorAll('.nav-btn').forEach(link => {
const navPath = link.getAttribute('data-path')?.replace(/\/$/, '');
if (navPath === path) {
link.className = 'nav-btn font-semibold px-0 py-2 rounded flex items-center gap-1 bg-gray-200 text-black';
}
});
});