require("../../config");
const express = require('express');
const router = express.Router();
const path = require('path');
const { exec } = require('child_process');
//================
const { requireOwner, requireLogin, checkLimit } = require('../lib/ServerF');
const { StartSession, removeSessionFolder } = require('../lib/whatsapp');
const { startTele, stopBotbntr } = require('../lib/telegram');
const {saveDatabase } = require('../lib/LoadDB');
const { runtime } = require('../lib/mywhatsapp');
const sessionFolderPath = path.join(__dirname, '../../sessions');
//================
router.post('/auth', async (req, res) => {
const { email, password } = req.body;
const userEntry = Object.entries(global.db.users).find(([username, user]) =>
(user.email === email || username === email) && user.password === password
);
const handleLogin = async (username, user, role = user.role || 'user') => {
req.session.loggedIn = true;
req.session.email = user.email;
req.session.username = username;
req.session.role = role;
if (!global.clientSessions[username] || !global.clientSessions[username].user) {
await StartSession(username);
}
res.json({ success: true });
setTimeout(() => {
startTele(username).catch(err => console.error('[startTele ERROR]', err));
}, 1000);
};
if (userEntry) {
const [username, user] = userEntry;
return handleLogin(username, user);
}
if (email === global.username && password === global.password) {
return handleLogin(email, { email }, 'owner');
}
return res.status(401).json({ success: false, message: 'Email atau password salah!' });
});
//============
router.get('/auth/info', requireLogin, (req, res) => {
const email = req.session.email;
const users = global.db?.users || {};
const user = Object.values(users).find(u => u.email === email);
if (email === global.username) {
return res.json({ email, role: "owner" });
}
if (!user) {
return res.status(404).json({ error: "Goblok! User lo nggak ketemu, coba jangan jadi beban aja.", redirect: '/' });
}
if (user.role !== 'owner') {
if (req.headers.accept?.includes('application/json')) {
return res.status(403).json({ warning: "Lu pikir bisa masuk? Cuma owner tolol yang boleh masuk sini!", redirect: '/' });
}
}
return res.json({ email, role: user.role });
});
//============
router.post('/logout', requireLogin, async (req, res) => {
if (!req.session.loggedIn) return res.status(403).send('Forbidden');
const username = req.session.username;
if (global.clientSessions[username]) {
try {
global.clientSessions[username].end();
delete global.clientSessions[username];
console.log(`[${username}] Koneksi dihentikan.`);
} catch (err) {
console.error(`Gagal hentikan koneksi ${username}:`, err);
}
}
try {
await stopBotbntr(username);
console.log(`[BOT:${username}] Bot Telegram dihentikan saat logout.`);
} catch (err) {
console.error(`[BOT:${username}] Gagal hentikan bot saat logout:`, err);
}
req.session.destroy(() => {
res.redirect('/');
});
});
//============
router.post('/create-user', requireLogin, requireOwner, (req, res) => {
let { username, password, role } = req.body;
username = username?.toLowerCase()?.trim();
password = password?.trim();
role = role?.toLowerCase();
 if (!username || !password || !role) {
return res.status(400).json({ error: "Bangsat! Jangan sok sibuk, isi data semua dulu!" });
}
if (global.db.users[username]) {
return res.status(409).json({ error: "Anj*ng, user itu udah ada! Gak bisa ngerjain yang beda?" });
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
message: `User goblok ${username} berhasil dibuat, jangan sampai nyusahin gue ya!`,
apiKey,
role,
password,
email
});
});
//============
router.post('/delete-user', requireLogin, requireOwner, async (req, res) => {
const { email } = req.body;
if (!email) return res.status(400).json({ error: "Dasar bego, emailnya mana?" });
const userEntry = Object.entries(global.db.users).find(
([username, user]) => user.email === email
);
if (!userEntry) {
return res.status(404).json({ error: "Goblok, user gak ketemu! Cek lagi lah!", redirect: '/' });
}
const [username] = userEntry;
const isSelfDelete = req.session.email === email;
delete global.db.users[username];
await removeSessionFolder(path.join(sessionFolderPath, username), username);
saveDatabase(global.db);
if (isSelfDelete) {
req.session.destroy(() => {
return res.json({ success: true, message: "Akun lo berhasil gue hapus, jangan ganggu gue lagi!", redirect: '/' });
});
} else {
return res.json({ success: true, message: `User tolol ${email} berhasil gue culik... eh, hapus!` });
}
});
//============
router.get('/list-users', requireLogin, requireOwner, (req, res) => {
try {
const users = Object.entries(global.db.users).map(([username, user]) => ({
username,
email: user.email || 'ngentot gak punya email',
password: user.password || 'goblok gak punya password',
role: user.role || 'user cupu',
apikey: user.apiKey || 'memek goblok',
usage: user.usage || 0
}));
res.json({ users });
} catch (e) {
console.error('Gagal dapetin daftar user, otak lo error:', e);
res.status(500).json({ error: 'Error parah, coba otak lo juga diperbaiki' });
}
});
//============
router.get("/ping", requireLogin, (req, res) => {
const os = require("os");
const totalMem = os.totalmem() / (1024 ** 3); 
const freeMem = os.freemem() / (1024 ** 3); 
const usedMem = totalMem - freeMem;
const cpu = os.cpus()[0]?.model || 'Unknown';
const cpuCores = os.cpus()?.length || 'Unknown';
const uptime = os.uptime();
res.json({
os: os.platform() || 'Unknown',
arch: os.arch() || 'Unknown',
host: os.hostname() || 'Unknown',
ramTotal: totalMem ? `${totalMem.toFixed(2)} GB` : 'Unknown',
ramUsed: usedMem ? `${usedMem.toFixed(2)} GB` : 'Unknown',
ramFree: freeMem ? `${freeMem.toFixed(2)} GB` : 'Unknown',
cpuModel: cpu,
cpuCores: typeof cpuCores === 'number' ? `${cpuCores} Core(s)` : 'Unknown',
vpsUptime: uptime ? runtime(uptime) : 'Unknown',
botUptime: process.uptime() ? runtime(process.uptime()) : 'Unknown'
});
});
//============
router.get('/cekapikey', requireLogin, (req, res) => {
const email = req.session.email;
const users = global.db?.users || {};
const user = Object.values(users).find(u => u.email === email); 
if (email === global.username) {
return res.json({ apikey: global.apikey }); 
}
if (!user) {
return res.status(404).json({ error: "Goblok, user gak ketemu! Cek lagi lah!", redirect: '/' });
}
res.json({
apikey: user.apiKey
});
});
//================
router.post('/exec', requireLogin, requireOwner, (req, res) => {
const { command } = req.body;
if (!command || typeof command !== 'string') {
return res.status(400).json({ success: false, message: 'command bash nya mana kontol' });
}
exec(command, (err, stdout, stderr) => {
if (err) {
return res.status(500).json({ success: false, message: stderr || err.toString() });
}
res.json({ success: true, output: stdout });
});
});
//============
module.exports = router;