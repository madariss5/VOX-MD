const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 
const { useMultiFileAuthState, makeWASocket } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");

const SESSION_DIR = path.join(__dirname, "../../Sessions/");

if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
}

module.exports = async (client, m, Owner, body) => {
    if (!Owner) return m.reply("❌ *Only the bot owner can use this command!*");

    const args = body.split(" ");
    const command = args[0].toLowerCase();
    const sessionName = args[1];

    if (!sessionName) return m.reply("❌ *Usage:* `.connect <session_name>`");

    const sessionPath = path.join(SESSION_DIR, sessionName);

    if (command === ".connect") {
        if (fs.existsSync(sessionPath)) {
            return m.reply(`⚠️ *Session '${sessionName}' is already connected!*`);
        }

        const sessionData = args.slice(2).join(" ");

        if (!sessionData) {
            return m.reply("❌ *Please provide the Base64 session string!*");
        }

        try {
            const sessionJson = Buffer.from(sessionData, "base64").toString("utf-8");
            fs.writeFileSync(sessionPath, sessionJson);

            const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
            const bot = makeWASocket({
                auth: state,
                printQRInTerminal: false
            });

            bot.ev.on("creds.update", saveCreds);

            return m.reply(`✅ *Connected successfully to '${sessionName}'!*`);
        } catch (err) {
            return m.reply("❌ *Failed to connect bot session!*");
        }
    }

    if (command === ".disconnect") {
        if (!fs.existsSync(sessionPath)) {
            return m.reply(`⚠️ *Session '${sessionName}' is not connected!*`);
        }

        try {
            fs.rmSync(sessionPath, { recursive: true, force: true });
            return m.reply(`✅ *Session '${sessionName}' has been disconnected!*`);
        } catch (err) {
            return m.reply("❌ *Failed to disconnect session!*");
        }
    }

    m.reply("❌ *Invalid command! Use `.connect <session_name> <base64 session>` or `.disconnect <session_name>`*");
};
