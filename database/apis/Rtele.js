const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { startBot, stopBot, isBotRunning } = require('../lib/telegram');
const { requireLogin, checkLimit } = require('../lib/ServerF');
const BOT_DIR = path.join(__dirname, '../../sessions');
//===================
router.post('/connect-tele', requireLogin, checkLimit, async (req, res) => {
const username = req.session.username;
const token = req.body.token;
if (!username || !token) {
return res.status(400).json({ success: false, message: 'Lo gak ngirim username atau token, goblok!' });
}
if (isBotRunning(username)) {
return res.status(400).json({ success: false, message: 'Bot lo udah jalan, jangan sok sibuk!' });
}
try {
startBot(username, token);
res.json({ success: true, message: `Bot goblok buat ${username} udah nyala, jangan ngecek terus!` });
} catch (err) {
console.error('Start Bot Error:', err);
res.status(500).json({ success: false, message: 'Gagal start bot, otak lo error!' });
}
});
//===================
router.get('/connected-tele', requireLogin, async (req, res) => {
const username = req.session.username;
const isOwner = req.session.role === 'owner';
try {
if (!(await fs.pathExists(BOT_DIR))) {
return res.status(200).json({ success: true, total: 0, data: [] });
}
const files = await fs.readdir(BOT_DIR);
const data = [];
for (const file of files) {
const fullPath = path.join(BOT_DIR, file);
if (!(await fs.stat(fullPath)).isFile()) continue;
if (path.extname(file) !== '.json') continue;
const botUser = path.basename(file, '.json');
if (!isOwner && botUser !== username) continue;
if (!isBotRunning(botUser)) continue;
data.push({
username: botUser,
id: botUser,
pushName: botUser
});
}
return res.status(200).json({ success: true, total: data.length, data });
} catch (err) {
console.error('Connected Bots Error:', err);
return res.status(500).json({ success: false, message: 'Server error, lo sabar ya, goblok!' });
}
});
//===================
router.post('/logout-tele', requireLogin, async (req, res) => {
const { username } = req.body;
const requester = req.session.username;
const requesterRole = req.session.role || 'user';
if (!username) {
return res.status(400).json({ success: false, message: 'Yah, mana username nya? Gak usah sok!' });
}
const isOwner = requesterRole === 'owner';
if (!isOwner && username !== requester) {
return res.status(403).json({ success: false, message: 'Lo gak punya hak, jangan sok atur bot orang lain!' });
}
try {
if (isBotRunning(username)) {
await stopBot(username);
}
delete global.telegramSessions[username];
global.connectedBots = global.connectedBots.filter(bot => bot.username !== username);
await fs.remove(path.join(BOT_DIR, `${username}.json`));
return res.status(200).json({ success: true, message: `Sip, bot ${username} udah gue logoutin. Jangan nyusahin lagi!` });
} catch (err) {
console.error('Logout Telegram Error:', err);
return res.status(500).json({ success: false, message: 'Gagal logout, coba jangan goblok dan ulangin lagi nanti.' });
}
});
//===================
router.get('/status-tele', requireLogin, (req, res) => {
const username = req.session.username;
const bot = global.telegramSessions[username];
if (bot) {
return res.status(200).json({ connected: true });
} else {
return res.status(200).json({ connected: false });
}
});
module.exports = router;