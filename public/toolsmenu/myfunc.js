//===========
window.addEventListener('DOMContentLoaded', () => {
setTimeout(() => {
const splash = document.getElementById('splashScreen');
const main = document.getElementById('mainContent');
splash?.classList.add('fade-out');
setTimeout(() => {
splash?.remove();
main?.classList.remove('hidden');
}, 400);
}, 800);
});
//===========
const uploadForm = document.getElementById('uploadForm');
const uploadInput = document.getElementById('fileInput');
const uploadList = document.getElementById('userList1');
const uploadBtn = document.getElementById('uploadBtn');
const uploadSpinner = uploadBtn.querySelector('.spinner');
const uploadLabel = uploadBtn.querySelector('.label');
uploadForm.addEventListener('submit', async (e) => {
e.preventDefault();
const file = uploadInput.files[0];
if (!file) {
alert('Pilih file dulu, Darling~');
return;
}
uploadSpinner.classList.remove('hidden');
uploadLabel.textContent = 'Uploading...';
uploadBtn.disabled = true;
const formData = new FormData();
formData.append('file', file);
formData.append('filename', file.name);
try {
const res = await fetch('/api/upload', { method: 'POST', body: formData });
uploadSpinner.classList.add('hidden');
if (!res.ok) {
uploadLabel.textContent = 'Upload';
uploadBtn.disabled = false;
return alert('Gagal upload file!');
}
const data = await res.json();
const directLink = data.directLink;
const item = document.createElement('li');
item.className = 'bg-white/50 dark:bg-[#24242C] p-4 rounded shadow border-l-4 border-blue-500 dark:border-blue-500 flex items-center justify-between gap-4';
const linkText = document.createElement('input');
linkText.type = 'text';
linkText.readOnly = true;
linkText.className = 'text-sm w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-2 py-1 rounded';
linkText.value = directLink;
const copyBtn = document.createElement('button');
copyBtn.textContent = 'Copy';
copyBtn.className = 'bg-[color:var(--button-blue)] dark:bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-600 hover:bg-blue-900';
copyBtn.onclick = () => {
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(directLink).then(() => {
copyBtn.textContent = 'Copied!';
setTimeout(() => {
while (uploadList.firstChild) {
uploadList.removeChild(uploadList.firstChild);
}
uploadBtn.classList.remove('hidden');
uploadLabel.textContent = 'Upload';
uploadBtn.disabled = false;
}, 2000);
}).catch(() => {
fallbackCopyTextToClipboard(directLink);
});
} else {
fallbackCopyTextToClipboard(directLink);
}
};

function fallbackCopyTextToClipboard(text) {
const textArea = document.createElement("textarea");
textArea.value = text;
document.body.appendChild(textArea);
textArea.focus();
textArea.select();
try {
const successful = document.execCommand('copy');
if (successful) {
copyBtn.textContent = 'Copied!';
setTimeout(() => {
while (uploadList.firstChild) {
uploadList.removeChild(uploadList.firstChild);
}
uploadBtn.classList.remove('hidden');
uploadLabel.textContent = 'Upload';
uploadBtn.disabled = false;
}, 2000);
} else {
copyBtn.textContent = 'Copy';
}
} catch (err) {
copyBtn.textContent = 'Copy';
}
document.body.removeChild(textArea);
}
item.appendChild(linkText);
item.appendChild(copyBtn);
uploadList.prepend(item);
uploadForm.reset();
uploadLabel.textContent = 'Upload';
uploadBtn.disabled = false;
} catch (err) {
console.error(err);
uploadSpinner.classList.add('hidden');
uploadLabel.textContent = 'Upload';
uploadBtn.disabled = false;
alert('Terjadi kesalahan saat upload');
}
});
//===========
const encryptForm = document.getElementById('encryptForm');
const encryptInput = document.getElementById('encryptFileInput');
const encryptList = document.getElementById('userList2'); 
const encryptBtn = document.getElementById('encryptBtn');
const encryptSpinner = encryptBtn.querySelector('.spinner');
const encryptLabel = encryptBtn.querySelector('.label');
encryptForm.addEventListener('submit', async (e) => {
e.preventDefault();
const file = encryptInput.files[0];
const type = document.getElementById('encryptType').value;
if (!file) return alert('Pilih file .js dulu, Darling~');
if (!file.name.endsWith('.js')) return alert('Hanya file .js yang bisa dienkripsi!');
encryptSpinner.classList.remove('hidden');
encryptLabel.textContent = 'Encrypting...';
encryptBtn.disabled = true;
const formData = new FormData();
formData.append('file', file);
formData.append('type', type);
try {
const res = await fetch('/api/encrypt', { method: 'POST', body: formData });
encryptSpinner.classList.add('hidden');

if (!res.ok) {
const errorData = await res.json().catch(() => ({}));
encryptLabel.textContent = 'Encrypt';
encryptBtn.disabled = false;
return alert('Gagal mengenkripsi file! ' + (errorData.error || ''));
}
const { encrypted } = await res.json();
const blob = new Blob([encrypted], { type: 'application/javascript' });
const url = URL.createObjectURL(blob);
encryptBtn.classList.add('hidden');
const item = document.createElement('li');
item.className = 'bg-white/50 dark:bg-[#24242C] p-4 rounded shadow border-l-4 border-blue-500 dark:border-blue-500 flex items-center justify-between gap-4';
const linkText = document.createElement('input');
linkText.type = 'text';
linkText.readOnly = true;
linkText.className = 'text-sm w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-2 py-1 rounded';
linkText.value = url;
const copyBtn = document.createElement('button');
copyBtn.textContent = 'Download';
copyBtn.className = 'bg-[color:var(--button-blue)] dark:bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-600 hover:bg-blue-900';
copyBtn.onclick = () => {
const a = document.createElement('a');
a.href = url;
a.download = 'EncZ-' + type + '.js';
a.click();
copyBtn.textContent = 'Downloaded!';
setTimeout(() => {
encryptList.removeChild(item);
encryptBtn.classList.remove('hidden');
encryptLabel.textContent = 'Encrypt';
encryptBtn.disabled = false;
}, 1500);
};
item.appendChild(linkText);
item.appendChild(copyBtn);
encryptList.prepend(item);
encryptForm.reset();
} catch (err) {
console.error(err);
encryptSpinner.classList.add('hidden');
encryptLabel.textContent = 'Encrypt';
encryptBtn.disabled = false;
alert('Terjadi kesalahan saat mengenkripsi file!\nInfo: ' + err.message);
}
});
//=========
const decryptForm = document.getElementById('decryptForm');
const decryptInput = document.getElementById('decryptFileInput');
const decryptList = document.getElementById('userList3'); 
const decryptBtn = document.getElementById('decryptBtn');
const decryptSpinner = decryptBtn.querySelector('.spinner');
const decryptLabel = decryptBtn.querySelector('.label');
decryptForm.addEventListener('submit', async (e) => {
e.preventDefault();
const file = decryptInput.files[0];
if (!file) return alert('Pilih file .js dulu, Darling~');
if (!file.name.endsWith('.js')) return alert('Hanya file .js yang bisa didekripsi!');
decryptSpinner.classList.remove('hidden');
decryptLabel.textContent = 'Decrypting...';
decryptBtn.disabled = true;
const formData = new FormData();
formData.append('file', file);
formData.append('filename', file.name);
try {
const res = await fetch('/api/decrypt', { method: 'POST', body: formData });
decryptSpinner.classList.add('hidden');
if (!res.ok) {
const errorData = await res.json().catch(() => ({}));
decryptLabel.textContent = 'Decrypt';
decryptBtn.disabled = false;
return alert('Gagal mendekripsi file! ' + (errorData.error || ''));
}
const { decrypted } = await res.json();
if (!decrypted) throw new Error('Tidak ada hasil dekripsi');
const blob = new Blob([decrypted], { type: 'application/javascript' });
const url = URL.createObjectURL(blob);
decryptBtn.classList.add('hidden');
const item = document.createElement('li');
item.className = 'bg-white/50 dark:bg-[#24242C] p-4 rounded shadow border-l-4 border-blue-500 dark:border-blue-500 flex items-center justify-between gap-4';
const linkText = document.createElement('input');
linkText.type = 'text';
linkText.readOnly = true;
linkText.className = 'text-sm w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-2 py-1 rounded';
linkText.value = url;
const copyBtn = document.createElement('button');
copyBtn.textContent = 'Download';
copyBtn.className = 'bg-[color:var(--button-blue)] dark:bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-600 hover:bg-blue-900';
copyBtn.onclick = () => {
const a = document.createElement('a');
a.href = url;
a.download = 'DecZ.js';
a.click();
copyBtn.textContent = 'Downloaded!';
setTimeout(() => {
decryptList.removeChild(item);
decryptBtn.classList.remove('hidden');
decryptLabel.textContent = 'Decrypt';
decryptBtn.disabled = false;
}, 1500);
};
item.appendChild(linkText);
item.appendChild(copyBtn);
decryptList.prepend(item);
decryptForm.reset();
} catch (err) {
console.error(err);
decryptSpinner.classList.add('hidden');
decryptLabel.textContent = 'Decrypt';
decryptBtn.disabled = false;
alert('Terjadi kesalahan saat mendekripsi file!\nInfo: ' + err.message);
}
});
//=========
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
link.className = 'nav-btn font-semibold hover:bg-gray-300 dark:hover:bg-gray-800 px-3 py-3 rounded flex items-center gap-1 bg-gray-300 dark:bg-gray-800';
}
});
});