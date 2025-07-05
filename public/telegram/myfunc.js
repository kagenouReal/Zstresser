tailwind.config = {
darkMode: "class",
};
let isSidebarOpen = false;
function sidebarToggle(e) {
const sidebar = document.querySelector("aside");
const overlay = document.getElementById("overlay");
const toggleBtn = document.getElementById("sidebarToggle");
if (e) e.stopPropagation();
if (!isSidebarOpen) {
sidebar.classList.remove("animate-slide-out");
sidebar.classList.add("animate-slide-in");
sidebar.classList.remove("-translate-x-full");
overlay?.classList.remove("hidden");
isSidebarOpen = true;
setTimeout(() => {
document.addEventListener("click", outsideClickListener);
}, 10);
} else {
closeSidebar();
}
}
function closeSidebar() {
const sidebar = document.querySelector("aside");
const overlay = document.getElementById("overlay");
sidebar.classList.remove("animate-slide-in");
sidebar.classList.add("animate-slide-out");
overlay?.classList.add("hidden");
setTimeout(() => {
sidebar.classList.add("-translate-x-full");
isSidebarOpen = false;
document.removeEventListener("click", outsideClickListener);
}, 300); 
}
function outsideClickListener(event) {
const sidebar = document.querySelector("aside");
const toggleBtn = document.getElementById("sidebarToggle");
if (
isSidebarOpen &&
!sidebar.contains(event.target) &&
!toggleBtn.contains(event.target)
) {
closeSidebar();
}
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
//=========
async function handleTelegramConnect() {
const tokenInput = document.getElementById('telegramToken');
const connectBtn = document.getElementById('connectBtn');
const token = tokenInput.value.trim();
if (!token) {
connectBtn.textContent = "Enter a token";
return;
}
connectBtn.textContent = "Connecting...";
connectBtn.disabled = true;
try {
const res = await fetch('/api/connect-tele', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ token })
});
const data = await res.json();
if (data.success) {
setTimeout(() => {
connectBtn.textContent = "Connected!";
checktelegramStatus();
loadTelegramBotList()
}, 1500); 
} else {
connectBtn.textContent = "Failed!";
connectBtn.disabled = false;
}
} catch (err) {
connectBtn.textContent = "Error!";
connectBtn.disabled = false;
}
}
//°°=°°°°°°°°°°
async function checktelegramStatus() {
const pairSection = document.getElementById('pairbottele');
try {
const res = await fetch('/api/status-tele');
const data = await res.json();
setTimeout(() => {
if (data.connected) {
pairSection.classList.add("hidden"); 
} else {
pairSection.classList.remove("hidden");
}
}, 800);
} catch (err) {
console.error("Status check error:", err);
}
}
//=========
function loadTelegramBotList() {
fetch('/api/connected-tele')
.then(res => res.json())
.then(({ success, data }) => {
if (!success) return;
const list = document.getElementById('telegramBotList');
list.innerHTML = '';
if (data.length === 0) {
list.innerHTML = '<li class="text-gray-500">Tidak ada bot Telegram terdaftar.</li>';
} else {
data.forEach(bot => {
const li = document.createElement('li');
li.className = 'flex items-center justify-between gap-3 bg-white/50 dark:bg-[#24242C] p-3 rounded shadow';
const info = document.createElement('span');
info.innerHTML = `<strong>${bot.username}</strong>`;
const btn = document.createElement('button');
btn.textContent = 'Stop';
btn.className = 'bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded';
btn.addEventListener('click', async () => {
const res = await fetch('/api/logout-tele', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ username: bot.username })
});
const result = await res.json();
if (result.success) {
alert(`Bot ${bot.username} dihentikan.`);
li.remove();
checktelegramStatus();
} else {
alert(`Gagal stop bot: ${result.message}`);
}
});
li.appendChild(info);
li.appendChild(btn);
list.appendChild(li);
});
}
})
.catch(err => {
console.error('Gagal ambil data bot:', err);
document.getElementById('telegramBotList').innerHTML = '<li class="text-red-500">Gagal memuat data.</li>';
});
}
//=========
document.addEventListener('DOMContentLoaded', () => {
checktelegramStatus();
loadTelegramBotList();
});
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
document.addEventListener('DOMContentLoaded', () => {
const path = window.location.pathname.replace(/\/$/, '');
document.querySelectorAll('.nav-btn').forEach(link => {
const navPath = link.getAttribute('data-path')?.replace(/\/$/, '');
if (navPath === path) {
link.className = 'nav-btn font-semibold hover:bg-gray-300 dark:hover:bg-gray-800 px-3 py-3 rounded flex items-center gap-1 bg-gray-300 dark:bg-gray-800';
}
});
});