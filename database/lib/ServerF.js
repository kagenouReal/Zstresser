require('../../config');
const os = require('os');
const {parseInterval, runtime, loadDatabase, saveDatabase } = require('./LoadDB');
global.db = loadDatabase();
//=============
function checkLimit(req, res, next) {
const apiKey = req.query.apikey || req.headers['x-api-key'];
if (apiKey && apiKey === global.apikey) {
req.session = req.session || {};
req.session.username = global.username;
return next();
}
const username = req.session?.username;
let user = global.db?.users?.[username];
const isMainOwner = username === global.username;
if (!user && isMainOwner) {
user = { role: 'owner', usage: 0 };
}
if (!user) {
return res.status(403).json({ error: 'User tidak ditemukan', redirect: '/' });
}
const role = user.role || 'user';
const limits = global.limitConfig || {
user: 15,
premium: 30,
owner: Infinity
};
if (!user.usage) user.usage = 0;
if (user.usage >= limits[role]) {
return res.status(429).json({
success: false,
error: `Limit harian ${role} tercapai. Upgrade akunmu!`
});
}
user.usage++;
if (!isMainOwner) {
global.db.users[username] = user;
saveDatabase(global.db);
}
next();
}
//============
global.resetIntervalMs = parseInterval(global.resetInterval); 
function resetUsageAll() {
if (!global.db || !global.db.users) return;
for (const email in global.db.users) {
if (global.db.users[email]) {
global.db.users[email].usage = 0;
console.log(`Reset usage untuk user ${email}`);
}
}
saveDatabase(global.db);
console.log(`[Limit] Semua usage berhasil direset`);
}
setInterval(() => {
resetUsageAll(); 
}, global.resetIntervalMs);
//============
function requireLogin(req, res, next) {
const apiKey = req.query.apikey || req.headers['x-api-key'];
if (apiKey && apiKey === global.apikey) {
req.session = req.session || {};
req.session.username = global.username;
return next();
}
const users = global.db?.users || {};
const foundUser = Object.entries(users).find(([username, data]) => data.apiKey === apiKey);
if (foundUser) {
const [username] = foundUser;
req.session = req.session || {};
req.session.username = username;
return next();
}
if (!req.session.loggedIn) {
if (req.method === 'GET') {
return res.redirect('/');
} else {
return res.status(401).json({ success: false, error: 'Unauthorized. Silahkan login dulu' });
}
}
next();
}
//============
function preventLoginIfLoggedIn(req, res, next) {
if (req.session.loggedIn) {
return res.redirect('/dashboard'); 
}
next();
}
//============
function requireOwner(req, res, next) {
const apiKey = req.query.apikey || req.headers['x-api-key'];
if (apiKey && apiKey === global.apikey) {
req.session = req.session || {};
req.session.username = global.username;
return next();
}
const foundUser = Object.entries(global.db?.users || {})
.find(([uname, data]) => data.apiKey === apiKey);
if (foundUser) {
const [username, data] = foundUser;
if (data.role !== 'owner') {
return res.status(403).json({ error: "403: Lu Bukan Owner Anjg" });
}
req.session = req.session || {};
req.session.username = username;
return next();
}
if (!req.session?.loggedIn || !req.session.username) {
return res.status(401).json({ error: "Unauthorized. Silakan login terlebih dahulu" });
}
const username = req.session.username;
let sessionUser = global.db?.users?.[username];
if (!sessionUser && username === global.username) {
sessionUser = { role: 'owner' };
}
if (!sessionUser) {
return res.status(404).json({ error: "User tidak ditemukan", redirect: '/' });
}
if (sessionUser.role !== 'owner') {
console.log(`User ${username} mencoba mengakses rute owner tanpa hak akses`);
if (req.headers.accept?.includes('application/json')) {
return res.status(403).json({ error: "403: Lu Bukan Owner Anjg", redirect: '/' });
} else {
return res.redirect('/');
}
}
console.log(`User ${username} memiliki akses ke rute owner`);
return next();
}
//============
function getDeviceInfo() {
let nets = {};
try {
nets = os.networkInterfaces() || {};
} catch (e) {
nets = { error: 'Tidak bisa mengambil network interface (kemungkinan karena permission atau sistem).' };
}
const cpus = os.cpus();
return {
hostname: os.hostname() || 'Unknown',
platform: os.platform() || 'Unknown',
release: os.release() || 'Unknown',
arch: os.arch() || 'Unknown',
cpu: cpus?.[0]?.model || 'Unknown',
totalMemory: os.totalmem()
? (os.totalmem() / 1024 / 1024).toFixed(2) + ' MB'
: 'Unknown',
freeMemory: os.freemem()
? (os.freemem() / 1024 / 1024).toFixed(2) + ' MB'
: 'Unknown',
uptime: os.uptime()
? (os.uptime() / 60).toFixed(2) + ' menit'
: 'Unknown',
networkInterfaces: nets,
};
}
module.exports = { getDeviceInfo, requireOwner, preventLoginIfLoggedIn, requireLogin, resetUsageAll, checkLimit };