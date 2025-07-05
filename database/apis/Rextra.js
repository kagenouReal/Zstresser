require("../../config");
const express = require('express');
const router = express.Router();
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');
const JsConfuser = require('js-confuser');
//================
const { requireOwner, requireLogin, checkLimit } = require('../lib/ServerF');
const { loadDatabase } = require('../lib/LoadDB');
//================
router.post('/upload', requireLogin, checkLimit, async (req, res) => {
const contentType = req.headers['content-type'] || '';
const boundary = contentType.match(/boundary=(.*)$/)?.[1];
if (!boundary) return res.status(400).send('Missing boundary');
let body = [];
req.on('data', chunk => body.push(chunk));
req.on('end', async () => {
try {
body = Buffer.concat(body);
const parts = body.toString().split(`--${boundary}`);
const filePart = parts.find(part => part.includes('filename='));
if (!filePart) return res.status(400).send('No file uploaded');
const filenameMatch = filePart.match(/filename="(.+?)"/);
if (!filenameMatch) return res.status(400).send('Filename missing');
const filename = filenameMatch[1];
const ext = filename.split('.').pop().toLowerCase();
if (!ext || ext.length > 5) return res.status(400).send('400: Invalid file extension');
const start = body.indexOf('\r\n\r\n') + 4;
const end = body.lastIndexOf(`--${boundary}--`) - 2;
const fileBuffer = body.slice(start, end);
const form = new FormData();
form.append('fileToUpload', fileBuffer, `file.${ext}`);
form.append('reqtype', 'fileupload');
const catbox = await fetch('https://catbox.moe/user/api.php', {
method: 'POST',
body: form,
headers: form.getHeaders()
});
const result = await catbox.text();
if (result.startsWith('https://')) {
const fileId = result.split('/')[3];
const newLink = `${global.domain}/api/file?id=${fileId}`;
res.json({ directLink: newLink });
} else {
res.status(500).send('500: Upload failed');
}
} catch (err) {
console.error(err);
res.status(500).send('500: Internal server error');
}
});
});
//============
router.get('/file', async (req, res) => {
const fileId = req.query.id;
if (!fileId) {
return res.status(400).send('400: file id nya mana kontll')}
const fileUrl = `https://files.catbox.moe/${fileId}`;
try {
const fileResponse = await fetch(fileUrl);
if (!fileResponse.ok) {
return res.status(500).send('500: Failed to fetch file from Catbox')}
const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
const contentDisposition = `attachment; filename="${fileId}"`;
res.setHeader('Content-Type', contentType);
res.setHeader('Content-Disposition', contentDisposition);
fileResponse.body.pipe(res);
} catch (err) {
console.error('Download error:', err.message);
res.status(500).send('500: Failed to download file');
}});
//============
router.post('/encrypt', requireLogin, checkLimit, async (req, res) => {
const contentType = req.headers['content-type'] || '';
const boundary = contentType.match(/boundary=(.*)$/)?.[1];
if (!boundary) return res.status(400).send('Missing boundary');
let body = [];
req.on('data', chunk => body.push(chunk));
req.on('end', async () => {
try {
body = Buffer.concat(body);
const parts = body.toString('binary').split(`--${boundary}`);
const filePart = parts.find(part => part.includes('filename='));
if (!filePart) return res.status(400).send('No file uploaded');
const filenameMatch = filePart.match(/filename="(.+?)"/);
if (!filenameMatch) return res.status(400).send('Filename missing');
const filename = filenameMatch[1];
if (!filename.endsWith('.js'))
return res.status(400).send('400: cuma bisa enc js kontol');
const start = body.indexOf('\r\n\r\n', body.indexOf(filename)) + 4;
const end = body.indexOf(`\r\n--${boundary}`, start);
const fileBuffer = body.slice(start, end);
const jsCode = fileBuffer.toString('utf-8');
const typeMatch = body.toString().match(/name="type"\r\n\r\n(.*?)\r\n--/);
const selectedType = typeMatch?.[1]?.trim() || 'low';
let options;
switch (selectedType) {
case 'low':
options = {
target: 'node',
preset: 'low'
};
break;
case 'medium':
options = {
target: "node",
compact: true,
hexadecimalNumbers: true,
controlFlowFlattening: 0.05,
deadCode: 0.005,
dispatcher: 0.2,
duplicateLiteralsRemoval: 0.2,
minify: true,
movedDeclarations: true,
renameVariables: true,
stringConcealing: true,
variableMasking: 0.1,
stringSplitting: 0.05,
renameLabels: true,
preserveFunctionLength: true,
lock: { antiDebug: true },
identifierGenerator: function () {
return "愛KAGEAJA愛" + Math.random().toString(36).substring(7);
}
};
break;
case 'hard':
options = {
target: "node",
calculator: true,
compact: true,
hexadecimalNumbers: true,
controlFlowFlattening: 0.2,
deadCode: 0.02,
dispatcher: 0.4,
duplicateLiteralsRemoval: 0.3,
minify: true,
movedDeclarations: true,
objectExtraction: true,
renameVariables: true,
variableMasking: 0.3,
stringConcealing: true,
stringSplitting: 0.2,
renameLabels: true,
preserveFunctionLength: true,
lock: { antiDebug: true },
identifierGenerator: function () {
return "神殺ZSTRESZER暗黒神" + Math.random().toString(36).substring(7);
}
};
break;
case 'extreme':
options = {
target: "node",
calculator: true,
compact: true,
hexadecimalNumbers: true,
controlFlowFlattening: true, 
deadCode: true,
dispatcher: true,
duplicateLiteralsRemoval: true, 
minify: true,
movedDeclarations: true,
objectExtraction: true,
renameVariables: true,
variableMasking: true, 
stringConcealing: true,
stringSplitting: true, 
renameLabels: true,
preserveFunctionLength: true,
lock: {
antiDebug: true
},
identifierGenerator: () => {
return "影ZSTRESZER零EXTREME影" + Math.random().toString(36).substring(2, 6);
}
};
break;
default:
options = {
target: 'node',
preset: 'low'
};
break;
}
const result = await JsConfuser.obfuscate(jsCode, options);
res.json({ encrypted: result.code });
} catch (err) {
console.error(err);
res.status(500).send('500: Internal server error');
}
});
req.on('error', (err) => {
console.error('Request error:', err);
res.status(500).send('500: Request error');
});
});
//===========
router.post('/decrypt', requireLogin, checkLimit, async (req, res) => {
try {
const { webcrack } = await import('webcrack');
const contentType = req.headers['content-type'] || '';
const boundary = contentType.match(/boundary=(.*)$/)?.[1];
if (!boundary) return res.status(400).send('Missing boundary');
let body = [];
req.on('data', chunk => body.push(chunk));
req.on('end', async () => {
try {
body = Buffer.concat(body);
const parts = body.toString('binary').split(`--${boundary}`);
const filePart = parts.find(part => part.includes('filename='));
if (!filePart) return res.status(400).send('No file uploaded');
const filenameMatch = filePart.match(/filename="(.+?)"/);
if (!filenameMatch) return res.status(400).send('Filename missing');
const filename = filenameMatch[1];
if (!filename.endsWith('.js')) return res.status(400).send('400: cuma bisa decrypt file js');
const start = body.indexOf('\r\n\r\n', body.indexOf(filename)) + 4;
const end = body.indexOf(`\r\n--${boundary}`, start);
const fileBuffer = body.slice(start, end);
const encryptedCode = fileBuffer.toString('utf-8');
const result = await webcrack(encryptedCode);
const decryptedCode = result.code;
res.json({ decrypted: decryptedCode });
} catch (err) {
console.error(err);
res.status(500).send('500: Internal server error');
}
});
req.on('error', (err) => {
console.error('Request error:', err);
res.status(500).send('500: Request error');
});
} catch (importErr) {
console.error('Import error:', importErr);
res.status(500).send('500: Failed to load decrypt module');
}
});
//===========
module.exports = router;