function animatePress(el) {
el.classList.remove('animate-press');
void el.offsetWidth; 
el.classList.add('animate-press');
}
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
window.onload = function() {
fetch('/status-wa')
.then(response => response.json())
.then(data => {
if (!data.connected) {
window.location.href = '/'; 
}
})
.catch(err => {});
};
//Whatsap Apis
async function sendMessage(btn) {
const nomor = document.getElementById('nomor').value.trim();
const type = document.getElementById('attackType').value;
if (!nomor || type === 'Select Type Bug' || !type) {
return;
if (!/^\d+$/.test(nomor)) return 
}btn.disabled = true;
btn.textContent = 'Sending...';
try {
const res = await fetch('/send-crash', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ nomor, type })
});
const result = await res.json();
if (result.success) {
btn.textContent = 'Bug berhasil dikirim!';
} else {
alert(`${result.error}`);
}
} catch (err) {
console.error(err);
} finally {
setTimeout(() => {
btn.disabled = false;
btn.textContent = 'Send Crash';
}, 850); 
}
}