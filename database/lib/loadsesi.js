const fs = require("fs-extra");
const path = require("path");
const { StartSession, removeSessionFolder } = require('./makesocket');
//=============
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
module.exports = autoStartAllSessions;