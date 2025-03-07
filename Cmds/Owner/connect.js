const fs = require("fs");
const path = require("path");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

module.exports = async (context) => {
    const { client, m, text, prefix } = context;

    if (m.sender !== "254114148625@s.whatsapp.net") {
        return m.reply("❌ *You are not authorized to use this command!*");
    }

    if (!text || !m.quoted || !m.quoted.text) {
        return m.reply(`❌ *Usage:*\n\`${prefix}connect <session_name>\` (Reply with Base64 session)`);
    }

    const sessionName = text.trim();
    const sessionBase64 = m.quoted.text.trim();
    const sessionPath = path.join(__dirname, "../../session", sessionName);

    try {
        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }

        const sessionData = Buffer.from(sessionBase64, "base64").toString("utf-8");
        fs.writeFileSync(path.join(sessionPath, "creds.json"), sessionData);

        await m.reply(`✅ *Session '${sessionName}' has been connected successfully!*\n\n⏳ *Starting bot...*`);

        // Start the new bot instance
        startBot(sessionName, m);
    } catch (error) {
        console.error("❌ Error in connectbot.js:", error);
        await m.reply("❌ *Failed to save or start session. Please check the Base64 data and try again!*");
    }
};

async function startBot(sessionName, m) {
    try {
        const sessionPath = path.join(__dirname, "../../session", sessionName);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const bot = makeWASocket({ auth: state });

        bot.ev.on("creds.update", saveCreds);
        bot.ev.on("connection.update", async ({ connection }) => {
            if (connection === "open") {
                await m.reply(`✅ *Bot '${sessionName}' is now online!*`);
            } else if (connection === "close") {
                await m.reply(`❌ *Bot '${sessionName}' disconnected. Check logs for errors.*`);
            }
        });
    } catch (error) {
        console.error("❌ Error in startBot():", error);
        await m.reply(`❌ *Failed to start bot '${sessionName}'. Check the session file or logs.*`);
    }
            }
