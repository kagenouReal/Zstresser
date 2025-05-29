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
window.onload = function () {
fetchPing();
};
async function fetchPing() {
try {
const res = await fetch('/api/ping');
const data = await res.json();
document.getElementById('osPlatform').innerText = `${data.os} (${data.arch})`;
document.getElementById('ramTotal').innerText = data.ramTotal;
document.getElementById('ramUsed').innerText = data.ramUsed;
document.getElementById('ramFree').innerText = data.ramFree;
document.getElementById('cpuModel').innerText = data.cpuModel;
document.getElementById('cpuCores').innerText = data.cpuCores;
document.getElementById('vpsUptime').innerText = data.vpsUptime;
document.getElementById('botUptime').innerText = data.botUptime;
document.getElementById('hostName').innerText = data.host;
} catch (e) {
console.error("Gagal ambil data ping:", e);
}
}
//===========
tailwind.config = {
darkMode: "class",
};
function toggleSidebar() {
const sidebar = document.querySelector("aside");
sidebar.classList.toggle("-translate-x-full");
toggleOverlay();
}
function toggleDarkMode() {
document.documentElement.classList.toggle("dark");
const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
localStorage.setItem("theme", theme);
const link = document.querySelector('.nav-dor'); 
if (link) {
if (theme === "dark") {
link.className = 'nav-dor font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 rounded transition px-3 py-3 rounded flex items-center gap-1 bg-gray-300 dark:bg-gray-800';
} else {
link.className = 'nav-dor font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 rounded transition';
}
}
}
document.addEventListener("DOMContentLoaded", () => {
if (localStorage.getItem("theme") === "dark") {
document.documentElement.classList.add("dark");
const link = document.querySelector('.nav-dor'); 
if (link) {
link.className = 'nav-dor font-semibold hover:bg-gray-300 dark:hover:bg-gray-800 px-3 py-3 rounded flex items-center gap-1 bg-gray-300 dark:bg-gray-800';
}
}
});
function toggleOverlay() {
const overlay = document.getElementById("overlay");
overlay.classList.toggle("hidden");
}
document.addEventListener("DOMContentLoaded", () => {
document.getElementById("overlay").addEventListener("click", () => {
toggleSidebar();
});
});
//===========
window.addEventListener('DOMContentLoaded', () => {
setTimeout(() => {
const splash = document.getElementById('splashScreen');
const main = document.getElementById('mainContent');

splash.classList.add('fade-out');
setTimeout(() => {
splash.remove();
main?.classList.remove('hidden');
}, 500);
}, 1000); 
});
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
document.addEventListener('DOMContentLoaded', () => {
const path = window.location.pathname.replace(/\/$/, '');
document.querySelectorAll('.nav-btn').forEach(link => {
const navPath = link.getAttribute('data-path')?.replace(/\/$/, '');
if (navPath === path) {
link.className = 'nav-btn font-semibold hover:bg-gray-300 dark:hover:bg-gray-800 px-3 py-3 rounded flex items-center gap-1 bg-gray-300 dark:bg-gray-800';
}
});
});
//==========
const fake = {
total: 5730,
crash: 12,
other: 578,
lastCrash: "2025-05-23 22:12"
};
const gagal = fake.crash + fake.other;
const sukses = fake.total - gagal;
document.getElementById("totalReq").innerText = fake.total;
document.getElementById("successReq").innerText = sukses;
document.getElementById("failReq").innerText = gagal;
document.getElementById("lastCrash").innerText = fake.lastCrash;