//===========
window.addEventListener('DOMContentLoaded', () => {
setTimeout(() => {
const splash = document.getElementById('splashScreen');
const main = document.getElementById('mainContent');
splash.classList.add('fade-out');
setTimeout(() => {
splash.remove();
main?.classList.remove('hidden');
}, 400);
}, 800); 
});
//===========
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
async function sendMessage(btn) {
const nomor = document.getElementById('nomor').value.trim();
const type = document.getElementById('attackType').value;
if (!nomor || type === 'Select Type Bug' || !type) {
return;
if (!/^\d+$/.test(nomor)) return 
}btn.disabled = true;
btn.textContent = 'Attacking...';
try {
const res = await fetch('/api/send-crash', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ nomor, type })
});
const result = await res.json();
if (result.success) {
setTimeout(() => {
btn.textContent = 'Succes Attack..';
}, 1200); 
} else {
alert(`${result.error}`);
}
} catch (err) {
console.error(err);
} finally {
setTimeout(() => {
btn.disabled = false;
btn.textContent = 'Send Crash';
}, 2000); 
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
async function loadConnectedUsers() {
try {
const res = await fetch('/api/connected-wa');
const { success, data } = await res.json();
if (!success) return;
const userList = document.getElementById('userList');
userList.innerHTML = '';
if (data.length === 0) {
userList.innerHTML = '<li class="text-gray-500">Tidak ada Bot Whatsapp terdaftar.</li>';
} else {
data.forEach(user => {
const li = document.createElement('li');
li.className = 'flex items-center justify-between gap-3 bg-white/50 dark:bg-[#24242C] p-3 rounded shadow';
const userInfo = document.createElement('span');
userInfo.innerHTML = `
<strong>${user.pushName || user.name || user.id}</strong><br>
<span class="text-sm font-normal text-gray-500">${user.id}</span>
`;
const logoutBtn = document.createElement('button');
logoutBtn.textContent = 'Logout';
logoutBtn.className = 'bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded';
logoutBtn.addEventListener('click', async (e) => {
e.stopPropagation();
const confirmLogout = confirm(`Logout ${user.id}?`);
if (!confirmLogout) return;
const res = await fetch('/api/logout-wa', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ jid: user.jid || user.id })
});
const result = await res.json();
if (result.success) {
alert(`Berhasil logout: ${result.message || user.id}`);
li.remove();
checkWhatsAppStatus();
} else {
alert(`Gagal logout: ${result.message || 'Terjadi kesalahan'}`);
}
});

li.appendChild(userInfo);
li.appendChild(logoutBtn);
userList.appendChild(li);
});
}
} catch (err) {
console.error('Gagal mengambil data:', err);
document.getElementById('userList').innerHTML = '<li class="text-red-500">Gagal memuat data.</li>';
}
}
//=========
//Whatsap Apis
async function checkWhatsAppStatus() {
const pairSection = document.getElementById('pairSection');
try {
const res = await fetch('/api/status-wa');
const data = await res.json();
setTimeout(() => {
if (!data.connected) {
pairSection.classList.remove("hidden");
}
}, 800);
} catch (err) {}
}
//=========
document.addEventListener('DOMContentLoaded', () => {
checkWhatsAppStatus();
loadConnectedUsers();
});
//=========
async function handlePairing() {
const button = document.getElementById('generateBtn');
const nomor = document.getElementById('nomor2').value.trim();
const defaultText = button.textContent;
if (!/^\d+$/.test(nomor)) {
return;
}
button.disabled = true;
button.textContent = "Memproses...";
try {
const res = await fetch('/api/connect-wa', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ nomor })
});
const data = await res.json();
if (res.ok && data.code) {
button.textContent = `Kode: ${data.code}`;
setTimeout(() => {
button.textContent = defaultText;
button.disabled = false;
checkWhatsAppStatus()
loadConnectedUsers()
}, 30000);
checkWhatsAppStatus()
loadConnectedUsers()
} else {
alert(data.message || data.error || "Terjadi kesalahan.");
button.textContent = defaultText;
button.disabled = false;
}
} catch (err) {
alert("Terjadi kesalahan saat menghubungkan.");
console.error(err);
button.textContent = defaultText;
button.disabled = false;
}
}
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