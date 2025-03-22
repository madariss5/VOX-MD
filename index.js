/* VOX-MD - The Modern WhatsApp Bot */

// ✅ Import Required Modules
const { 
    default: VOXMDConnect, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeInMemoryStore, 
    downloadContentFromMessage, 
    jidDecode, 
    proto, 
    getContentType 
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

const { 
    imageToWebp, 
    videoToWebp, 
    writeExifImg, 
    writeExifVid 
} = require('./lib/exif');

const { 
    isUrl, 
    generateMessageTag, 
    getBuffer, 
    getSizeMedia, 
    fetchJson, 
    await, 
    sleep 
} = require('./lib/botFunctions');

const store = makeInMemoryStore({ 
    logger: pino().child({ level: "silent", stream: "store" }) 
});

// ✅ Load Settings & Session
const { session } = require("./settings");
const authenticateSession = require('./kanambo'); // Import from kanambo.js
authenticateSession(); 

const path = require('path');
const sessionName = path.join(__dirname, '..', 'session');

const { smsg } = require("./smsg");
const { 
    autoview, 
    presence, 
    autoread, 
    botname, 
    autobio, 
    mode, 
    prefix, 
    dev, 
    autolike 
} = require("./settings");

const { commands, totalCommands } = require("./VoxMdhandler");
const groupEvents = require("./groupEvents.js");

// ✅ Start VOXMD
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
setInterval(() => store.writeToFile("store.json"), 3000);

// ✅ Auto-bio update
if (autobio === "true") {
    setInterval(() => {
        const date = new Date();
        client.updateProfileStatus(
            `⚡ ${botname} is active 24/7 ⚡\n📅 ${date.toLocaleString("en-US", { timeZone: "Africa/Nairobi", weekday: "long" })}`
        );
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
        if (mek.key.remoteJid === "status@broadcast") {
            if (autoview) await client.readMessages([mek.key]);

            if (autolike) {
                try {
                    const mokayas = await client.decodeJid(client.user.id);
                    const reactEmoji = "💓"; // Custom emoji
                    if (!mek.status) {
                        await client.sendMessage(mek.key.remoteJid, {
                            react: { key: mek.key, text: reactEmoji }
                        }, { statusJidList: [mek.key.participant, mokayas] });
                    }
                } catch (error) {}
            }
        }

        // ✅ Auto-read private messages
        if (autoread && mek.key.remoteJid.endsWith("@s.whatsapp.net")) {
            await client.readMessages([mek.key]);
        }

        // ✅ Presence Updates
        if (mek.key.remoteJid.endsWith("@s.whatsapp.net")) {
            const chat = mek.key.remoteJid;
            switch (presence.toLowerCase()) {
                case "online":
                    await client.sendPresenceUpdate("available", chat);
                    break;
                case "typing":
                    await client.sendPresenceUpdate("composing", chat);
                    break;
                case "recording":
                    await client.sendPresenceUpdate("recording", chat);
                    break;
                default:
                    await client.sendPresenceUpdate("unavailable", chat);
                    break;
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

    } catch (error) {}
});

    // ✅ Handle connection updates
    client.ev.on("connection.update", async (update) => {
        const { connection } = update;

        if (connection === "open") {
            console.log(chalk.greenBright(`✅ Connection successful!\nLoaded ${totalCommands} commands.\nVOX-MD is active.`));

            let message = `╭═══💠 *VOX-MD BOT* 💠═══╮\n`;
            message += `┃   _*BOT STATUS*_: Online✅\n`;
            message += `┃ 🔓 *MODE:* ${mode.toUpperCase()}\n`;
            message += `┃ 📝 *PREFIX:* ${prefix}\n`;
            message += `┃ ⚙️ *COMMANDS:* ${totalCommands}\n`;
            message += `┃ 📡 *LIBRARY:* Baileys\n`;
            message += `╰═══〘 *KANAMBO* 〙═══╯\n\n`;
            message += `✨ Welcome to *VOX-MD*! 🚀\n`;

            await client.sendMessage("120363405166148822@g.us", { text: message });
        }
    });

    client.ev.on("creds.update", saveCreds);
}

// ✅ Start Express Server
app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(port, () => console.log("🚀 Server listening on: http://localhost:" + port));

startVOXMD();