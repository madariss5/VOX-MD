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
const events = require("events");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const FileType = require("file-type");
const express = require("express");
const { execSync } = require("child_process");
const { DateTime } = require("luxon");
const chalk = require("chalk");
const app = express();
const port = process.env.PORT || 10000;
const store = makeInMemoryStore({ logger: pino().child({ level: "silent" }) });

const { session } = require("./settings");
const { smsg } = require("./smsg");
const { autoview, autoread, botname, autobio, mode, prefix, dev, autolike } = require("./settings");
const { commands, totalCommands } = require("./VoxMdhandler");
const groupEvents = require("./groupEvents.js");

// ✅ Corrected Base64 session decoding
async function authenticateSession() {
    try {
        const sessionPath = "./session/creds.json";

        if (!fs.existsSync("./session")) {  
            fs.mkdirSync("./session");  
        }  

        if (!fs.existsSync(sessionPath) && session !== "zokk") {  
            console.log("📡 Connecting...");  
            const sessionData = Buffer.from(session, "base64").toString("utf8");  
            fs.writeFileSync(sessionPath, sessionData, "utf8");  
        }  
    } catch (e) {  
        console.log("❌ Session is invalid: " + e);  
    }
}

authenticateSession();

// Prevent duplicate event listeners
process.removeAllListeners("uncaughtException");
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
});

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

    if (autobio === "true") {
        setInterval(() => {
            const date = new Date();
            client.updateProfileStatus(
                `⚡ ${botname} is active 24/7 ⚡\n📅 ${date.toLocaleString("en-US", { timeZone: "Africa/Nairobi", weekday: "long" })}`
            );
        }, 10 * 1000);
    }

    client.ev.removeAllListeners("messages.upsert"); // Prevent duplicate listeners
    client.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            let mek = chatUpdate.messages[0];
            if (!mek?.message) return;

            mek.message = mek.message.ephemeralMessage ? mek.message.ephemeralMessage.message : mek.message;

            // ✅ Auto-view and react to status updates with 🥷 if enabled
            if (autoview === "true" && mek.key?.remoteJid === "status@broadcast") {
                await client.readMessages([mek.key]);

                if (autolike === "true" && mek.key.participant) {
                    try {
                        await client.sendMessage(mek.key.remoteJid, {
                            react: { key: mek.key, text: "💓" }
                        });
                        console.log(`✅ Sent auto-like reaction to ${mek.key.participant}`);
                    } catch (error) {
                        console.error("❌ Error sending reaction:", error.message);
                    }
                } else {
                    console.log("⚠️ Autolike is disabled or participant not found.");
                }
            }

            // ✅ Auto-read private messages
            if (autoread === "true" && mek.key?.remoteJid?.endsWith("@s.whatsapp.net")) {
                await client.readMessages([mek.key]);
            }

            // ✅ Ensure sender's number is correctly extracted
            let sender = mek.key?.remoteJid || mek.participant || mek.key?.participant;
            if (!sender) return console.log("⚠️ Sender is undefined.");

            console.log(`📩 New Message from: ${sender}`);

            // ✅ Owner & Developer Check
            const ownerNumber = "254114148625";
            if (mode?.toLowerCase() === "private") {
                const allowedUsers = [`${ownerNumber}@s.whatsapp.net`, `${dev}@s.whatsapp.net`];

                if (!mek.key.fromMe && !allowedUsers.includes(sender)) {
                    console.log(`⛔ Ignoring message from: ${sender} (Not allowed in private mode)`);
                    return;
                }
            }

            let m = smsg(client, mek, store);
            require("./Voxdat")(client, m, chatUpdate, store);
        } catch (error) {
            console.error("❌ Error in messages.upsert event:", error);
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

            await client.sendMessage("254114148625@s.whatsapp.net", { text: message });
        }
    });

    client.ev.on("creds.update", saveCreds);
}

app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(port, () => console.log("🚀 Server listening on: http://localhost:" + port));

startVOXMD();