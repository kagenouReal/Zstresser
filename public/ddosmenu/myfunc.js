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
'>┌───────────────────────────────┐',
`>│ Target : ${target.padEnd(24)}`,
`>│ Mode : ${mode.padEnd(24)}`,
`>│ Status : ✅ Running... `,
'>└───────────────────────────────┘',
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
document.addEventListener('DOMContentLoaded', () => {
const path = window.location.pathname.replace(/\/$/, '');
document.querySelectorAll('.nav-btn').forEach(link => {
const navPath = link.getAttribute('data-path')?.replace(/\/$/, '');
if (navPath === path) {
link.className = 'nav-btn font-semibold px-0 py-2 rounded flex items-center bg-gray-200 text-black';
}
});
});