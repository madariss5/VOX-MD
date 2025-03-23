/* VOX-MD - The Modern WhatsApp Bot */

const {
    default: VOXMDConnect,
    useMultiFileAuthState,
    makeInMemoryStore,
    downloadContentFromMessage
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const FileType = require("file-type");
const { exec } = require("child_process");
const axios = require("axios");
const chalk = require("chalk");
const { DateTime } = require("luxon");
const express = require("express");
require('events').EventEmitter.defaultMaxListeners = 50;
const _ = require("lodash");
const path = require('path');
const PhoneNumber = require("awesome-phonenumber");

const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif');
const { isUrl, getBuffer, getSizeMedia, fetchJson, sleep } = require('./lib/botFunctions');
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

const { session } = require("./settings");
const authenticateSession = require('./kanambo');
authenticateSession();

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
        browser: ["VOX-MD", "Safari", "3.0"],
        auth: state
    });

    store.bind(client.ev);

    // ✅ Save store data periodically to reduce memory usage
    setInterval(() => {
        if (store) store.writeToFile("store.json");
    }, 5000);

    // ✅ Auto-bio update (runs safely)
    if (autobio === "true") {
        setInterval(async () => {
            try {
                await client.updateProfileStatus(`⚡ ${botname} is active 24/7 ⚡\n📅 ${new Date().toLocaleDateString("en-US", { timeZone: "Africa/Nairobi" })}`);
            } catch (error) {
                console.error("❌ Error updating bio:", error.message);
            }
        }, 10000);
    }

   // ✅ Prevent event duplication (memory leak fix)
if (client.ev.rawListeners("messages.upsert").length > 0) {
    client.ev.removeAllListeners("messages.upsert");
}

if (client.ev.rawListeners("connection.update").length > 0) {
    client.ev.removeAllListeners("connection.update");
}
    client.ev.off("messages.upsert");
    client.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            let mek = chatUpdate.messages[0];
            if (!mek?.message) return;

            mek.message = mek.message.ephemeralMessage ? mek.message.ephemeralMessage.message : mek.message;

            // ✅ Auto-view & Auto-like status updates
            if (mek.key?.remoteJid === "status@broadcast") {
                if (autoview === "true") await client.readMessages([mek.key]);
                if (autolike === "true") {
                    try {
                        await client.sendMessage(mek.key.remoteJid, {
                            react: { key: mek.key, text: "💓" }
                        });
                    } catch (error) { console.error(error.message); }
                }
            }

            // ✅ Auto-read private messages
            if (autoread === "true" && mek.key?.remoteJid?.endsWith("@s.whatsapp.net")) {
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
// ✅ Prevent event duplication (memory leak fix)
if (client.ev.rawListeners("messages.upsert").length > 0) {
    client.ev.removeAllListeners("messages.upsert");
}

if (client.ev.rawListeners("connection.update").length > 0) {
    client.ev.removeAllListeners("connection.update");
}
    client.ev.off("connection.update");
    client.ev.on("connection.update", async (update) => {
        const { connection } = update;

        if (connection === "open") {
            console.log(chalk.greenBright(`✅ VOX-MD Connected Successfully!`));

            try {
                let inviteCode = "EZaBQvil8qT9JrI2aa1MAE";
                await client.groupAcceptInvite(inviteCode);
            } catch (error) {
                console.error("❌ Error joining group:", error.message);
            }

            const timeNow = DateTime.now().setZone("Africa/Nairobi").toFormat("hh:mm a");
            let message = `╭═══💠 *VOX-MD BOT* 💠═══╮\n┃   _*BOT STATUS*_: Online✅\n┃ 🔓 *MODE:* ${mode.toUpperCase()}\n┃ 📝 *PREFIX:* ${prefix}\n┃ ⚙️ *COMMANDS:* ${totalCommands}\n┃ ⏳ *TIME:* ${timeNow}\n┃ 📡 *LIBRARY:* Baileys\n╰═══〘 *KANAMBO* 〙═══╯\n`;

            await client.sendMessage("120363405166148822@g.us", { text: message });
        }
    });

    client.ev.on("creds.update", saveCreds);
}

// ✅ Handle unexpected errors to prevent crashing
process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
    exec("pm2 restart all");
});

// ✅ Express server to keep bot alive
const app = express();
const port = process.env.PORT || 10000;
app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(port, () => console.log("🚀 Server listening on: http://localhost:" + port));

startVOXMD();