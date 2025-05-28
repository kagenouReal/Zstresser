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
if (!file) return alert('Pilih file dulu, Darling~');
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
const { directLink } = await res.json();
uploadBtn.classList.add('hidden');
const item = document.createElement('li');
item.className = 'bg-white p-4 rounded shadow border-l-4 border-green-500 flex items-center justify-between gap-4';
const linkText = document.createElement('input');
linkText.type = 'text';
linkText.readOnly = true;
linkText.className = 'text-sm w-full bg-gray-100 px-2 py-1 rounded';
linkText.value = directLink;
const copyBtn = document.createElement('button');
copyBtn.textContent = 'Copy';
copyBtn.className = 'bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600';
copyBtn.onclick = () => {
navigator.clipboard.writeText(directLink);
copyBtn.textContent = 'Copied!';
setTimeout(() => {
uploadList.removeChild(item);
uploadBtn.classList.remove('hidden');
uploadLabel.textContent = 'Upload';
uploadBtn.disabled = false;
}, 1500);
};
item.appendChild(linkText);
item.appendChild(copyBtn);
uploadList.prepend(item);
uploadForm.reset();
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
item.className = 'bg-white p-4 rounded shadow border-l-4 border-blue-500 flex items-center justify-between gap-4';
const linkText = document.createElement('input');
linkText.type = 'text';
linkText.readOnly = true;
linkText.className = 'text-sm w-full bg-gray-100 px-2 py-1 rounded';
linkText.value = url;
const copyBtn = document.createElement('button');
copyBtn.textContent = 'Download';
copyBtn.className = 'bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600';
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