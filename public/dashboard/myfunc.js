function toggleMenu() {
const menu = document.getElementById('mobileMenu');
if (menu.style.display === 'none' || menu.style.display === '') {
menu.style.display = 'block';
menu.style.animation = 'slideIn 0.5s ease-in-out'; 
} else {
menu.style.animation = 'slideOut 0.5s ease-in-out'; 
setTimeout(function() {
menu.style.display = 'none'; 
}, 300); 
}
}
//=========
function animatePress(el) {
el.classList.remove('animate-press');
void el.offsetWidth; 
el.classList.add('animate-press');
}
//=========
fetch('/api/connected')
.then(res => res.json())
.then(({ success, data }) => {
if (!success) return;
const userList = document.getElementById('userList');
userList.innerHTML = '';

data.forEach(user => {
const li = document.createElement('li');
li.className = 'flex items-center justify-between gap-3 bg-white p-3 rounded shadow';

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

const res = await fetch('/api/logoutwa', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ jid: user.jid || user.id })
});

const result = await res.json();
if (result.success) {
alert(`Berhasil logout: ${result.message || user.id}`);
li.remove();
} else {
alert(`Gagal logout: ${result.message || 'Terjadi kesalahan'}`);
}
});

li.appendChild(userInfo);
li.appendChild(logoutBtn);
userList.appendChild(li);
});
})
.catch(err => {
console.error('Gagal mengambil data:', err);
document.getElementById('userList').innerHTML = '<li class="text-red-500">Gagal memuat data.</li>';
});
function logoutUser(jid) {
fetch('/api/logoutwa', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ jid: jid })
})
.then(res => res.json())
.then(({ success, message }) => {
if (success) {
alert(`Berhasil logout: ${message}`);
const userList = document.getElementById('userList');
const userItem = document.querySelector(`li[data-jid="${jid}"]`);
if (userItem) userItem.remove();
} else {
alert(`Gagal logout: ${message}`);
}
})
.catch(err => {
console.error('Logout Error:', err);
alert('Terjadi kesalahan saat logout.');
});
}
//=========
window.addEventListener("DOMContentLoaded", async () => {   
  try {
    const res = await fetch('/auth/info'); 
    const data = await res.json();
    if (data.role !== 'owner') {
      const adminWrapper = document.getElementById('adminControlWrapper');
      if (adminWrapper) adminWrapper.style.display = 'none';
    }
  } catch (err) {
    console.error("Gagal ambil info user:", err);
  }
});
window.addEventListener("DOMContentLoaded", async () => {
try {
const res = await fetch('/auth/info'); 
const data = await res.json();
if (data.role !== 'owner') {
const adminBtn = document.getElementById('cekownwa');
if (adminBtn) adminBtn.style.display = 'none';
}
} catch (err) {
console.error("Gagal ambil info user:", err);
}
});
//=========
async function fetchDeviceInfo() {
const infoBox = document.getElementById('deviceInfo');
infoBox.innerHTML = "Loading...";
try {
const res = await fetch('/device-info');
const data = await res.json();
infoBox.innerHTML = `
  <div class="bg-white text-black p-6 rounded-md shadow-md ring-1 ring-gray-300 space-y-1 font-mono text-sm">
    <div><strong>Hostname:</strong> ${data.hostname}</div>
    <div><strong>Platform:</strong> ${data.platform}</div>
    <div><strong>OS Version:</strong> ${data.release}</div>
    <div><strong>Arsitektur:</strong> ${data.arch}</div>
    <div><strong>CPU:</strong> ${data.cpu}</div>
    <div><strong>Total RAM:</strong> ${data.totalMemory}</div>
    <div><strong>Free RAM:</strong> ${data.freeMemory}</div>
    <div><strong>Uptime:</strong> ${data.uptime}</div>
  </div>
`;
} catch (err) {
infoBox.innerHTML = `<span style="color:red;">Gagal ambil data: ${err.message}</span>`;
}
}
fetchDeviceInfo();
//=========
window.addEventListener('DOMContentLoaded', () => {
setTimeout(() => {
const splash = document.getElementById('splashScreen');
const main = document.getElementById('mainContent');

splash.classList.add('fade-out');
setTimeout(() => {
splash.remove();
main.classList.remove('hidden');
}, 500);
}, 1000); 
});
//=========
document.getElementById("logout-button-1").addEventListener("click", async () => {
try {
const res = await fetch("/logout", {
method: "POST", 
credentials: "same-origin"
});
if (res.redirected) {
window.location.href = res.url; 
} else {
alert("Logout gagal atau tidak ada redirect");
}
} catch (err) {
console.error(err);
}
});
//=========
//Whatsap Apis
async function handleBugMenu(btn) {
animatePress(btn);
try {
const res = await fetch('/status-wa');
const data = await res.json();
if (data.connected) {
setTimeout(() => window.location.href = '/bugmenu', 120);
} else {
alert("WhatsApp belum terhubung");
}
} catch (err) {}
}
//=========
async function checkWhatsAppStatus() {
const pairSection = document.getElementById('pairSection');
try {
const res = await fetch('/status-wa');
const data = await res.json();
setTimeout(() => {
if (!data.connected) {
pairSection.classList.remove("hidden");
}
}, 800);
} catch (err) {}
}
window.onload = checkWhatsAppStatus;
//=========
async function getPairingCode(button) {
const nomor = document.getElementById('nomor').value.trim();
if (!/^\d+$/.test(nomor)) return 
const defaultText = button.textContent;
button.disabled = true;
button.textContent = "Memproses...";
try {
const res = await fetch('/connect', {
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
}, 30_000); 
} else {
button.textContent = defaultText;
button.disabled = false;
}
} catch (err) {
button.textContent = defaultText;
button.disabled = false;
}
}
//==========
async function handlePairing() {
const button = document.getElementById('generateBtn');
animatePress(button);
const nomor = document.getElementById('nomor').value.trim();
const defaultText = button.textContent;
if (!/^\d+$/.test(nomor)) {
alert('Nomor hanya boleh angka!');
return;
}
button.disabled = true;
button.textContent = "Memproses...";
try {
const res = await fetch('/connect', {
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
}, 30000);
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