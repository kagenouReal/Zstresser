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
return res.status(403).json({ error: '404: User nya gk ada', redirect: '/' });
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
error: `429: Limit ${role} Habis, Tunggu Reset Lagi!`
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
function resetUsageAll() {
if (!global.db || !global.db.users) return;
for (const email in global.db.users) {
if (global.db.users[email]) {
global.db.users[email].usage = 0;
console.log(`Reset Limit untuk user ${email}`);
}
}
saveDatabase(global.db);
console.log(`[Limit] Semua usage berhasil direset`);
}
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
return res.status(401).json({ success: false, error: '401: Pergi Login Dulu Anjg' });
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
return res.status(401).json({ error: "401: Pergi Login Dulu Anjg" });
}
const username = req.session.username;
let sessionUser = global.db?.users?.[username];
if (!sessionUser && username === global.username) {
sessionUser = { role: 'owner' };
}
if (!sessionUser) {
return res.status(404).json({ error: "404: User nya gk ada", redirect: '/' });
}
if (sessionUser.role !== 'owner') {
if (req.headers.accept?.includes('application/json')) {
return res.status(403).json({ error: "403: Lu Bukan Owner Anjg", redirect: '/' });
} else {
return res.redirect('/');
}
}
return next();
}
//============
module.exports = { requireOwner, preventLoginIfLoggedIn, requireLogin, resetUsageAll, checkLimit };