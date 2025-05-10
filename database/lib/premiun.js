//========KAGENOU========
const fs = require("fs-extra");
const filePath = "./database/Acceswa.json";
let premium = [];
try {
if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
premium = JSON.parse(fs.readFileSync(filePath, "utf8"));
if (!Array.isArray(premium)) throw new Error("Harus array!");
} catch (e) {
console.warn("⚠️ premium.json error, pakai array kosong.");
premium = [];
}
const savePremium = () => {
try {
fs.writeFileSync(filePath, JSON.stringify(premium, null, 2));
return true;
} catch (e) {
console.error("❌ Gagal simpan premium.json:", e);
return false;
}
};
const addPremiumUser = (userId) => {
if (premium.some(u => u.id === userId)) return false;
premium.push({ id: userId });
return savePremium();
};
const delPremiumUser = (userId) => {
const index = premium.findIndex(u => u.id === userId);
if (index === -1) return false;
premium.splice(index, 1);
return savePremium();
};
//=============
module.exports = {
addPremiumUser,
delPremiumUser
};