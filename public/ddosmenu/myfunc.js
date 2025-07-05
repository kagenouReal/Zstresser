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

//==========
const attackMethodSelect = document.getElementById('attackMethod');
const requestsInput = document.getElementById('attackRequests');
const threadsInput = document.getElementById('attackThreads');
const requestsField = requestsInput.parentElement;
const threadsField = threadsInput.parentElement;
const simpleOnly = ['quantum']; 
attackMethodSelect.addEventListener('change', () => {
const selected = attackMethodSelect.value.toLowerCase();
const isSimple = simpleOnly.includes(selected);
requestsField.style.display = isSimple ? 'none' : '';
threadsField.style.display = isSimple ? 'none' : '';
requestsInput.required = !isSimple;
threadsInput.required = !isSimple;
});
attackMethodSelect.dispatchEvent(new Event('change'));
document.getElementById('webAttackForm').addEventListener('submit', async (e) => {
e.preventDefault();
const btn = document.getElementById('attackBtn');
const btnText = btn.querySelector('span');
const logOutput = document.getElementById('attackLog');
const mode = attackMethodSelect.value;
const target = document.querySelector('[name="target"]').value;
const time = document.querySelector('[name="time"]').value;
const rate = document.querySelector('[name="rate"]').value;
const thread = document.querySelector('[name="thread"]').value;
btn.disabled = true;
btnText.innerHTML = '<i class="fas fa-cog fa-spin"></i> Attacking...';
logOutput.classList.remove('hidden');
logOutput.textContent = '';
await runFakeTerminal(3000);
try {
const res = await fetch('/api/send-attack', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ target, time, rate, thread, mode })
});
const data = await res.json();
if (res.ok) {
appendLog(logOutput, '> ' + (data.message));
logOutput.classList.replace("text-red-500", "text-green-400");
btnText.innerHTML = '<i class="fas fa-check-circle"></i> Attack Sent';
} else {
appendLog(logOutput, '> ' + (data.error));
logOutput.classList.replace("text-green-400", "text-red-500");
btnText.innerHTML = '<i class="fas fa-times-circle"></i> Error';
}
} catch (err) {
appendLog(logOutput, '> ' + (err.message || "Unknown error occurred."));
logOutput.classList.replace("text-green-400", "text-red-500");
btnText.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed';
}
setTimeout(() => {
btn.disabled = false;
btnText.innerHTML = '<i class=""></i> EXECUTE';
}, 3000);
});
function runFakeTerminal(duration = 3000) {
return new Promise((resolve) => {
const logBox = document.getElementById('attackLog');
const target = document.querySelector('[name="target"]').value;
const mode = attackMethodSelect.value; 

const logs = [
'>┌──────────────────────┐',
`>│Target: ${target.padEnd(24)}`,
`>│Mode: ${mode.padEnd(24)}`,
`>│Status: ✅ Running... `,
'>└──────────────────────┘',
];

let index = 0;
const maxLines = 20;
let lines = [];
const interval = setInterval(() => {
if (index < logs.length) {
lines.push(logs[index++]);
if (lines.length > maxLines) lines.shift();
logBox.textContent = lines.join('\n');
logBox.scrollTop = logBox.scrollHeight;
} else {
clearInterval(interval);
if (lines.length > maxLines) lines.shift();
logBox.textContent = lines.join('\n');
logBox.scrollTop = logBox.scrollHeight;
resolve();
}
}, duration / logs.length);
});
}

function appendLog(logBox, text, maxLines = 20) {
let lines = logBox.textContent.split('\n').filter(Boolean);
lines.push(text);
if (lines.length > maxLines) lines.shift();
logBox.textContent = lines.join('\n');
logBox.scrollTop = logBox.scrollHeight;
}
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
document.addEventListener('DOMContentLoaded', () => {
const path = window.location.pathname.replace(/\/$/, '');
document.querySelectorAll('.nav-btn').forEach(link => {
const navPath = link.getAttribute('data-path')?.replace(/\/$/, '');
if (navPath === path) {
link.className = 'nav-btn font-semibold hover:bg-gray-300 dark:hover:bg-gray-800 px-3 py-3 rounded flex items-center gap-1 bg-gray-300 dark:bg-gray-800';
}
});
});