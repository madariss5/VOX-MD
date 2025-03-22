/* VOX-MD - The Modern WhatsApp Bot */

const { default: VOXMDConnect, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, downloadContentFromMessage, jidDecode, proto, getContentType } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const FileType = require("file-type");
const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const chalk = require("chalk");
const { DateTime } = require("luxon");
const express = require("express");
require('events').EventEmitter.defaultMaxListeners = 50;

const app = express();
const port = process.env.PORT || 10000;
const _ = require("lodash");
const PhoneNumber = require("awesome-phonenumber");

const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif');
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep } = require('./lib/botFunctions');

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
const { session } = require("./settings");
const authenticateSession = require('./kanambo'); // Import authentication function

authenticateSession(); // Call authentication function

const path = require('path');
const sessionName = path.join(__dirname, '..', 'session');

const { smsg } = require("./smsg");
const { autoview, presence, autoread, botname, autobio, mode, prefix, dev, autolike } = require("./settings");
const { commands, totalCommands } = require("./VoxMdhandler");
const groupEvents = require("./groupEvents.js");

store.bind(client.ev);
setInterval(() => store.writeToFile("store.json"), 3000);

/* ✅ Auto-bio Update */
if (autobio === "true") {
    setInterval(async () => {
        const date = new Date();
        await client.updateProfileStatus(`⚡ ${botname} is active 24/7 ⚡\n📅 ${date.toLocaleString("en-US", { timeZone: "Africa/Nairobi", weekday: "long" })}`);
    }, 10 * 1000);
}

/* ✅ Message Handling */
client.ev.on("messages.upsert", async (chatUpdate) => {
    try {
        let mek = chatUpdate.messages[0];
        if (!mek?.message) return;

        mek.message = mek.message.ephemeralMessage ? mek.message.ephemeralMessage.message : mek.message;

        let sender = mek.key?.remoteJid || mek.participant || mek.key?.participant;

        /* ✅ Auto-view & Auto-like Status */
        if (autoview?.toLowerCase() === "true" && mek.key?.remoteJid === "status@broadcast") {
            await client.readMessages([mek.key]);

            if (autolike?.toLowerCase() === "true") {
                try {
                    await client.sendMessage(mek.key.remoteJid, {
                        react: { key: mek.key, text: "💚" }
                    });
                } catch (error) {
                    console.error("❌ Error sending auto-like reaction:", error.message);
                }
            }
        }

        /* ✅ Auto-read Private Messages */
        if (autoread?.toLowerCase() === "true" && mek.key?.remoteJid?.endsWith("@s.whatsapp.net")) {
            await client.readMessages([mek.key]);
        }

        /* ✅ Presence Update */
        if (presence.toLowerCase() !== "off" && mek.key?.remoteJid.endsWith("@s.whatsapp.net")) {
            await client.sendPresenceUpdate(presence.toLowerCase(), mek.key.remoteJid);
        }

        /* ✅ Owner & Dev Check */
        const ownerNumber = "254114148625";
        if (mode?.toLowerCase() === "private" && !mek.key.fromMe && ![`${ownerNumber}@s.whatsapp.net`, `${dev}@s.whatsapp.net`].includes(sender)) {
            return;
        }

        let m = smsg(client, mek, store);
        require("./Voxdat")(client, m, chatUpdate, store);
    } catch (error) {
        console.error("❌ Error in messages.upsert:", error);
    }
});

/* ✅ Connection Update */
client.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
        try {
            let inviteCode = "EZaBQvil8qT9JrI2aa1MAE";
            let groupInfo = await client.groupGetInviteInfo(inviteCode);

            if (groupInfo) {
                await client.groupAcceptInvite(inviteCode);
                console.log("✅ Successfully joined the group.");
            } else {
                console.log("❌ Invalid or expired group invite.");
            }
        } catch (error) {
            console.error("❌ Error joining group:", error.message);
        }

        console.log(chalk.greenBright(`✅ Connection successful! Loaded ${totalCommands} commands.`));
    }
});

/* ✅ Handle Errors */
process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("rejectionHandled", (promise) => {
    console.log("Handled Rejection:", promise);
});

/* ✅ Start VOX-MD */
async function startVOXMD() {
    const { saveCreds, state } = await useMultiFileAuthState("session");
    
    const client = VOXMDConnect({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        version: [2, 3000, 1015901307],
        browser: ["VOX-MD", "Safari", "3.0"],
        auth: state
    });

    store.bind(client.ev);
    client.ev.on("creds.update", saveCreds);

    client.downloadMediaMessage = async (message) => { 
        const stream = await downloadContentFromMessage(message, getContentType(message));
        let buffer = Buffer.from([]);
        for await(const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }
        return buffer;
    };

    client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        const stream = await downloadContentFromMessage(message, getContentType(message));
        let buffer = Buffer.from([]);
        for await(const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }
        const type = await FileType.fromBuffer(buffer);
        const trueFileName = attachExtension ? `${filename}.${type.ext}` : filename;
        fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
    };

    console.log("🚀 VOX-MD is now running!");
}

startVOXMD();

app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(port, () => console.log("🚀 Server running on:", `http://localhost:${port}`));