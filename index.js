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
const figlet = require("figlet");
const express = require("express");
const app = express();
const port = process.env.PORT || 10000;
const _ = require("lodash");
const PhoneNumber = require("awesome-phonenumber");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require("./lib/exif");
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require("./lib/botFunctions");

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

const authentication = require("./kanambo.js");
const { smsg } = require("./smsg");
const { autoview, dev, autoread, botname, autobio, mode, prefix, presence, autolike } = require("./settings");
const { DateTime } = require("luxon");
const { commands, totalCommands } = require("./VoxMdhandler");


async function startVOXMD() {
    const { saveCreds, state } = await useMultiFileAuthState("session");
    const client = VOXMDConnect({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        version: [2, 3000, 1015901307],
        browser: ["VOX-MD", 'Safari', '3.0'],
        auth: state
    });

    store.bind(client.ev);
    setInterval(() => store.writeToFile("store.json"), 3000);

    if (autobio === 'true') {
        setInterval(async () => {
            try {
                const currentDate = DateTime.now().setZone("Africa/Nairobi").toFormat("EEEE");
                await client.updateProfileStatus(`⚡ ${botname} is active 24/7 ⚡\n📅 ${currentDate}`, {
                    headers: {
                        "If-Match": "*",
                        "If-Unmodified-Since": new Date().toUTCString()
                    }
                });
            } catch (err) {
                console.error("❌ Error updating profile status:", err);
            }
        }, 10 * 1000);
    }

    store.bind(client.ev);
    setInterval(() => store.writeToFile("store.json"), 3000);

    client.ev.removeAllListeners("messages.upsert"); // Prevent duplicate listeners
    client.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            let mek = chatUpdate.messages[0];
            if (!mek.message) return;

            mek.message = mek.message.ephemeralMessage ? mek.message.ephemeralMessage.message : mek.message;

            // ✅ Ensure sender's number is correctly extracted
            let sender = mek.key.remoteJid || mek.participant || mek.key.participant;
            console.log(`📩 New Message from: ${sender}`);
            console.log(`🤖 Bot Mode: ${mode}`);

            if (!sender) {
                console.log("⚠️ Sender is undefined. Possible issue with message format.");
                return;
            }

            // ✅ Owner & Developer Check
            const ownerNumber = "254114148625"; // Owner's WhatsApp number

            if (mode.toLowerCase() === "private") {
                const allowedUsers = [
                    `${ownerNumber}@s.whatsapp.net`,
                    `${dev}@s.whatsapp.net`
                ];

                if (!mek.key.fromMe && !allowedUsers.includes(sender)) {
                    console.log(`⛔ Ignoring message from: ${sender} (Not allowed in private mode)`);
                    return;
                }
            }

            let m = smsg(client, mek, store);
            require("./Voxdat")(client, m, chatUpdate, store);
        } catch (error) {
            console.error("❌ Error processing message:", error);
        }
    });

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
                const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;
                if (currentHour >= 5 && currentHour < 12) return '🌄 *Good Morning*';
                if (currentHour >= 12 && currentHour < 18) return '☀️ *Good Afternoon*';
                if (currentHour >= 18 && currentHour < 22) return '🌆 *Good Evening*';
                return '🌙 *Good Night*';
            };

            const getCurrentTimeInNairobi = () => DateTime.now().setZone('Africa/Nairobi').toFormat("hh:mm a");

            let message = `╭═══💠 *VOX-MD BOT* 💠═══╮\n`;
            message += `┃   _*BOT STATUS*_: Online✅\n`;
            message += `┃ 🔓 *MODE:* ${mode.toUpperCase()}\n`;
            message += `┃ 📝 *PREFIX:* ${prefix}\n`;
            message += `┃ ⚙️ *COMMANDS:* ${totalCommands}\n`;
            message += `┃ ⏳ *TIME:* ${getCurrentTimeInNairobi()}\n`;
            message += `┃ 📡 *LIBRARY:* Baileys\n`;
            message += `╰═══〘 *KANAMBO* 〙═══╯\n\n`;

            message += `✨ ${getGreeting()}, Welcome to *VOX-MD*! 🚀\n`;
            message += `🔥 Stay tuned for powerful features & updates!\n\n`;

            message += `╭───────────────╮\n`;
            message += `│   ⚡ *POWERED BY*  │\n`;
            message += `│   🌐 *©VOXNET.INC*   │\n`;
            message += `╰───────────────╯\n`;

            await client.sendMessage('254114148625@s.whatsapp.net', { text: message });
        } else if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            console.error(`⚠️ Connection closed: ${reason}`);

            if (reason === 428) {
                console.log("🚨 Error 428: Precondition Required. Retrying connection...");
                setTimeout(startVOXMD, 5000);
            } else if (reason === DisconnectReason.badSession) {
                console.log(`❌ Bad session detected. Deleting session...`);
                fs.rmSync("./session", { recursive: true, force: true });
                process.exit();
            } else {
                console.log("⚠️ Reconnecting...");
                setTimeout(startVOXMD, 5000);
            }
        }
    });

    client.ev.on("creds.update", saveCreds);
}

app.use(express.static('public'));
app.get("/", (req, res) => res.sendFile(__dirname + '/index.html'));
app.listen(port, () => console.log("🚀 Server listening on: http://localhost:" + port));

startVOXMD();