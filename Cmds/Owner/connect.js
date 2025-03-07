
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 
const { useMultiFileAuthState, makeWASocket } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");

const SESSION_DIR = path.join(__dirname, "../../Sessions/");

// Ensure session directory exists
if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
}

module.exports = async (client, m, Owner) => {
    if (!Owner) return client.sendMessage(m.chat, { text: "❌ *Only the bot owner can use this command!*" });

    const body = m.body || "";
    const args = body.split(" ");
    const command = args[0].toLowerCase();
    const sessionName = args[1];

    if (!sessionName) return client.sendMessage(m.chat, { text: "❌ *Usage:* `.connect <session_name>` (Reply to Base64 session)" });

    const sessionPath = path.join(SESSION_DIR, sessionName);

    if (command === ".connect") {
        if (fs.existsSync(sessionPath)) {
            return client.sendMessage(m.chat, { text: `⚠️ *Session '${sessionName}' is already connected!*` });
        }

        // Ensure user replied to the session string
        if (!m.quoted || !m.quoted.text) {
            return client.sendMessage(m.chat, { text: "❌ *Reply to a Base64 session string with `.connect <session_name>`*" });
        }

        const sessionData = m.quoted.text.trim();
        try {
            // Create session directory
            fs.mkdirSync(sessionPath, { recursive: true });

            // Decode and save session data
            const sessionJson = Buffer.from(sessionData, "base64").toString("utf-8");
            fs.writeFileSync(path.join(sessionPath, "creds.json"), sessionJson);

            // Load session
            const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
            const bot = makeWASocket({
                auth: state,
                printQRInTerminal: false
            });

            bot.ev.on("creds.update", saveCreds);

            return client.sendMessage(m.chat, { text: `✅ *Connected successfully as '${sessionName}'!*` });
        } catch (err) {
            console.error(err);
            return client.sendMessage(m.chat, { text: "❌ *Failed to connect bot session!*" });
        }
    }

    if (command === ".disconnect") {
        if (!fs.existsSync(sessionPath)) {
            return client.sendMessage(m.chat, { text: `⚠️ *Session '${sessionName}' is not connected!*` });
        }

        try {
            fs.rmSync(sessionPath, { recursive: true, force: true });
            return client.sendMessage(m.chat, { text: `✅ *Session '${sessionName}' has been disconnected!*` });
        } catch (err) {
            console.error(err);
            return client.sendMessage(m.chat, { text: "❌ *Failed to disconnect session!*" });
        }
    }

    client.sendMessage(m.chat, { text: "❌ *Invalid command! Use:*\n`.connect <session_name>` (Reply to Base64 session)\n`.disconnect <session_name>`" });
};
