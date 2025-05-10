
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
async function fetchUsers() {
try {
const res = await fetch('/list-users');
const data = await res.json();
const userList = document.getElementById('userList');
userList.innerHTML = '';
if (data.users && data.users.length > 0) {
data.users.forEach(user => {
const li = document.createElement('li');
li.className = "flex justify-between items-center bg-white p-4 rounded-lg shadow cursor-pointer";
const userSpan = document.createElement('span');
userSpan.innerHTML = `${user.username} <span class="text-sm text-gray-500"></span>`;
userSpan.className = "text-[color:var(--primary-blue-dark)]";
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
userList.innerHTML = '<li class="text-gray-500">Tidak ada user terdaftar.</li>';
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
const res = await fetch('/delete-user', {
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
const res = await fetch("/create-user", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ username, password, role }),
});
const data = await res.json();
await new Promise(resolve => setTimeout(resolve, 1000));
if (res.ok) {
button.textContent = "User berhasil dibuat.";
document.getElementById("createUserForm").reset();
fetchUsers();
} else {
alert(data.error || "Gagal membuat user.");
}
} catch (err) {}
setTimeout(() => {
button.textContent = originalText;
button.disabled = false;
}, 1000);
}
document.addEventListener('DOMContentLoaded', fetchUsers);