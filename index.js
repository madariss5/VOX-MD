/* VOX-MD - The Modern WhatsApp Bot */

const {
default: VOXMDConnect,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion,
makeInMemoryStore,
downloadContentFromMessage,
jidDecode,
proto,
getContentType,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const FileType = require("file-type");
const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const chalk = require("chalk");
const { DateTime } = require("luxon");
const figlet = require("figlet");
const express = require("express");
require('events').EventEmitter.defaultMaxListeners = 50;
const app = express();
const port = process.env.PORT || 10000;
const _ = require("lodash");
const PhoneNumber = require("awesome-phonenumber");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif');
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./lib/botFunctions');
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
const { session } = require("./settings");
const authenticateSession = require('./kanambo'); // Import from kanambo.js

authenticateSession(); // Call the function
const path = require('path');
const sessionName = path.join(__dirname, '..', 'session');
const { smsg } = require("./smsg");
const { autoview, presence, autoread, botname, autobio, mode, prefix, dev, autolike } = require("./settings");
const { commands, totalCommands } = require("./VoxMdhandler");
const groupEvents = require("./groupEvents.js");

async function startVOXMD() {
const { saveCreds, state } = await useMultiFileAuthState("session");
const client = VOXMDConnect({
logger: pino({ level: "silent" }),
printQRInTerminal: true,
version: [2, 3000, 1015901307],
browser: ["VOX-MD", "Safari", "3.0"],
auth: state
});

store.bind(client.ev);

// ✅ Save store data every 3 seconds
setInterval(() => {
    store.writeToFile("store.json");
}, 3000);

// ✅ Auto-bio update
if (autobio === "true") {
    setInterval(async () => {
        const date = new Date();
        try {
            await client.updateProfileStatus(
                `⚡ ${botname} is active 24/7 ⚡\n📅 ${date.toLocaleString("en-US", { timeZone: "Africa/Nairobi", weekday: "long" })}`
            );
        } catch (error) {
            console.error("❌ Error updating bio:", error.message);
        }
    }, 10 * 1000);
}

// ✅ Prevent duplicate event listeners
client.ev.removeAllListeners("messages.upsert");
client.ev.on("messages.upsert", async (chatUpdate) => {
    try {
        let mek = chatUpdate.messages[0];
        if (!mek?.message) return;

        mek.message = mek.message.ephemeralMessage ? mek.message.ephemeralMessage.message : mek.message;

        // ✅ Auto-view & Auto-like status updates
        if (autoview?.trim().toLowerCase() === "true" && mek.key?.remoteJid === "status@broadcast") {
            console.log("✅ Viewing status update...");
            await client.readMessages([mek.key]);

            if (autolike?.trim().toLowerCase() === "true") {
                console.log("✅ Attempting to send a reaction...");
                try {
                    let reactionKey = mek.key;
                    let reactEmoji = "💚"; // Default emoji
                    if (reactionKey && reactionKey.remoteJid && reactionKey.id) {
                        await client.sendMessage(reactionKey.remoteJid, {
                            react: { key: reactionKey, text: reactEmoji }
                        });
                        console.log(`✅ Sent auto-like reaction.`);
                    }
                } catch (error) {
                    console.error("❌ Error sending reaction:", error.message);
                }
            }
        }

        // ✅ Fix: Ensuring autolike runs correctly
        if (autolike?.trim().toLowerCase() === "true" && mek.key.remoteJid === "status@broadcast") {
            try {
                const mokayas = await client.decodeJid(client.user.id);
                const reactEmoji = "💓"; // Custom emoji
                if (!mek.status) {
                    await client.sendMessage(mek.key.remoteJid, {
                        react: { key: mek.key, text: reactEmoji }
                    }, { statusJidList: [mek.key.participant, mokayas] });
                }
            } catch (error) {
                console.error("❌ Error in autolike reaction:", error.message);
            }
        }

        // ✅ Auto-read private messages
        if (autoread?.trim().toLowerCase() === "true" && mek.key?.remoteJid?.endsWith("@s.whatsapp.net")) {
            await client.readMessages([mek.key]);
        }

        // ✅ Presence Updates
        if (mek.key?.remoteJid.endsWith("@s.whatsapp.net")) {
            let chat = mek.key.remoteJid;
            let presenceType = presence.toLowerCase();
            if (["online", "typing", "recording"].includes(presenceType)) {
                await client.sendPresenceUpdate(presenceType, chat);
            }
        }

        let sender = mek.key?.remoteJid || mek.participant || mek.key?.participant;

        // ✅ Owner & Developer Check
        const ownerNumber = "254114148625";
        if (mode?.toLowerCase() === "private") {
            const allowedUsers = [`${ownerNumber}@s.whatsapp.net`, `${dev}@s.whatsapp.net`];
            if (!mek.key.fromMe && !allowedUsers.includes(sender)) return;
        }

        let m = smsg(client, mek, store);
        require("./Voxdat")(client, m, chatUpdate, store);

    } catch (error) {
        console.error("❌ Error in messages.upsert event:", error.message);
    }
});

// ✅ Handle unhandled rejections & errors
const unhandledRejections = new Map();
process.on("unhandledRejection", (reason, promise) => {
unhandledRejections.set(promise, reason);
console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("rejectionHandled", (promise) => {
unhandledRejections.delete(promise);
});
process.on("Something went wrong", function (err) {
console.log("Caught exception: ", err);
});

// ✅ Decode JID function
client.decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {};
return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
} else return jid;
};

// ✅ Get Name function
client.getName = (jid, withoutContact = false) => {
id = client.decodeJid(jid);
withoutContact = client.withoutContact || withoutContact;
let v;
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {};
if (!(v.name || v.subject)) v = client.groupMetadata(id) || {};
resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
});
else v = id === "0@s.whatsapp.net" ? { id, name: "WhatsApp" } :
id === client.decodeJid(client.user.id) ? client.user :
store.contacts[id] || {};
return (withoutContact ? "" : v.name) || v.subject || v.verifiedName ||
PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
};

client.ev.removeAllListeners("connection.update"); // Prevent duplicate listeners
client.ev.on("connection.update", async (update) => {
const { connection, lastDisconnect } = update;

if (connection === "open") {    
    try {    
        let inviteCode = "EZaBQvil8qT9JrI2aa1MAE";    
        let groupInfo = await client.groupGetInviteInfo(inviteCode);    

        if (groupInfo) {    
            console.log("✅ Valid group invite. Joining...");    
            await client.groupAcceptInvite(inviteCode);    
        } else {    
            console.log("❌ Invalid or expired group invite.");    
        }    
    } catch (error) {    
        console.error("❌ Error joining group:", error.message);    
    }    

    console.log(chalk.greenBright(`✅ Connection successful!\nLoaded ${totalCommands} commands.\nVOX-MD is active.`));    

    const getGreeting = () => {    
        const currentHour = DateTime.now().setZone("Africa/Nairobi").hour;    
        if (currentHour >= 5 && currentHour < 12) return "🌄 *Good Morning*";    
        if (currentHour >= 12 && currentHour < 18) return "☀️ *Good Afternoon*";    
        if (currentHour >= 18 && currentHour < 22) return "🌆 *Good Evening*";    
        return "🌙 *Good Night*";    
    };    

    const getCurrentTimeInNairobi = () => DateTime.now().setZone("Africa/Nairobi").toFormat("hh:mm a");    

    let message = `╭═══💠 *VOX-MD BOT* 💠═══╮\n`;    
    message += `┃   _*BOT STATUS*_: Online✅\n`;    
    message += `┃ 🔓 *MODE:* ${mode.toUpperCase()}\n`;    
    message += `┃ 📝 *PREFIX:* ${prefix}\n`;    
    message += `┃ ⚙️ *COMMANDS:* ${totalCommands}\n`;    
    message += `┃ ⏳ *TIME:* ${getCurrentTimeInNairobi()}\n`;    
    message += `┃ 📡 *LIBRARY:* Baileys\n`;    
    message += `╰═══〘 *KANAMBO* 〙═══╯\n\n`;    
    message += `✨ ${getGreeting()}, Welcome to *VOX-MD*! 🚀\n`;    

    await client.sendMessage("120363405166148822@g.us", { text: message });    
}

});

client.ev.on("creds.update", saveCreds);
client.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || '';
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
const stream = await downloadContentFromMessage(message, messageType);
let buffer = Buffer.from([]);
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}

return buffer

};

client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message;
let mime = (message.msg || message).mimetype || '';
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
const stream = await downloadContentFromMessage(quoted, messageType);
let buffer = Buffer.from([]);
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);
}
let type = await FileType.fromBuffer(buffer);
const trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
// save to file
await fs.writeFileSync(trueFileName, buffer);
return trueFileName;
};

}

app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(port, () => console.log("🚀 Server listening on: http://localhost:" + port));

startVOXMD();

