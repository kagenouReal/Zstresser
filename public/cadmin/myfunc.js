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
async function fetchUsers() {
try {
const res = await fetch('/api/list-users');
const data = await res.json();
const userList = document.getElementById('userList');
userList.innerHTML = '';
if (data.users && data.users.length > 0) {
data.users.forEach(user => {
const li = document.createElement('li');
li.className = "bg-white/50 dark:bg-[#24242C] flex justify-between items-center bg-white p-4 rounded-lg shadow cursor-pointer";
const userSpan = document.createElement('span');
userSpan.innerHTML = `${user.username} <span class="text-sm text-gray-500"></span>`;
userSpan.className = "text-gray-800 dark:text-gray-300";
const deleteBtn = document.createElement('button');
deleteBtn.textContent = 'Hapus';
deleteBtn.className = 'delete-btn bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 text-sm rounded';
deleteBtn.dataset.email = user.email;
deleteBtn.addEventListener('click', async (e) => {
e.stopPropagation(); 
await deleteUser(user.email);
fetchUsers(); 
});
li.addEventListener('click', () => {
showUserDetail(user);
});
li.appendChild(userSpan);
li.appendChild(deleteBtn);
userList.appendChild(li);
});
} else {
userList.innerHTML = '<li class="text-gray-500">Tidak ada Account terdaftar.</li>';
}
} catch (err) {
console.error('Gagal fetch user:', err);
}
}
//============
function showUserDetail(user) {
const detail = 
`[ Information user ]
~Email: ${user.email}
~Username: ${user.username || '-'}
~Password: ${user.password || '-'}
~Role: ${user.role}
~Apikey: ${user.apikey || '-'}
~Usage: ${user.usage || 0}`;
alert(detail); 
}
//============
async function deleteUser(email) {
if (!confirm(`Yakin ingin hapus user ${email}?`)) return;
try {
const res = await fetch('/api/delete-user', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email })
});
const result = await res.json();
if (result.success) {
fetchUsers(); 
} else {
alert(result.error);
}
} catch (err) {
console.error('Gagal hapus user:', err);
}
}
document.addEventListener('click', function (e) {
if (e.target && e.target.matches('.delete-btn')) {
const email = e.target.getAttribute('data-email');
deleteUser(email);
}
});
//===========
async function createUser(event) {
event.preventDefault();
const username = document.getElementById("createEmail").value.trim();
const password = document.getElementById("createPassword").value.trim();
const role = document.getElementById("createRole").value;
const button = event.target.querySelector("button[type='submit']");
const originalText = button.textContent;
button.textContent = "Creating...";
button.disabled = true;
try {
const res = await fetch("/api/create-user", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ username, password, role }),
});
const data = await res.json();
await new Promise(resolve => setTimeout(resolve, 1000));
if (res.ok) {
button.textContent = "Account berhasil dibuat";
document.getElementById("createUserForm").reset();
fetchUsers();
} else {
alert(data.error || "Gagal membuat user.");
}
} catch (err) {}
setTimeout(() => {
button.innerHTML = '<i class="fas fa-plus-circle"></i> Create User';
button.disabled = false;
}, 1000);
}
document.addEventListener('DOMContentLoaded', fetchUsers);
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
document.addEventListener('DOMContentLoaded', () => {
const path = window.location.pathname.replace(/\/$/, '');
document.querySelectorAll('.nav-btn').forEach(link => {
const navPath = link.getAttribute('data-path')?.replace(/\/$/, '');
if (navPath === path) {
link.className = 'nav-btn font-semibold hover:bg-gray-300 dark:hover:bg-gray-800 px-3 py-3 rounded flex items-center gap-2 bg-gray-300 dark:bg-gray-800';
}
});
});