const { useMultiFileAuthState, makeWASocket } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");

const SESSION_DIR = path.join(__dirname, "../../Sessions/");

// Ensure session directory exists
if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
}

// Bot owner number (Replace if needed)
const OWNER_NUMBER = "254114148625";

module.exports = async (client, m) => {
    const senderNumber = m.key.participant ? m.key.participant.split("@")[0] : m.key.remoteJid.split("@")[0];

    if (senderNumber !== OWNER_NUMBER) {
        return client.sendMessage(m.key.remoteJid, { text: "❌ *This command is restricted to the bot owner!*" });
    }

    const body = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
    const args = body.split(" ");
    const command = args[0].toLowerCase();
    const sessionName = args[1];

    if (!sessionName) {
        return client.sendMessage(m.key.remoteJid, { text: "❌ *Usage:* `.connect <session_name>` (Reply to Base64 session)" });
    }

    const sessionPath = path.join(SESSION_DIR, sessionName);

    if (command === ".connect") {
        if (fs.existsSync(sessionPath)) {
            return client.sendMessage(m.key.remoteJid, { text: `⚠️ *Session '${sessionName}' is already connected!*` });
        }

        if (!m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) {
            return client.sendMessage(m.key.remoteJid, { text: "❌ *Reply to a Base64 session string with `.connect <session_name>`*" });
        }

        const sessionData = m.message.extendedTextMessage.contextInfo.quotedMessage.conversation.trim();
        try {
            fs.mkdirSync(sessionPath, { recursive: true });

            const sessionJson = Buffer.from(sessionData, "base64").toString("utf-8");
            fs.writeFileSync(path.join(sessionPath, "creds.json"), sessionJson);

            const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
            const bot = makeWASocket({
                auth: state,
                printQRInTerminal: false
            });

            bot.ev.on("creds.update", saveCreds);

            return client.sendMessage(m.key.remoteJid, { text: `✅ *Connected successfully as '${sessionName}'!*` });
        } catch (err) {
            console.error(err);
            return client.sendMessage(m.key.remoteJid, { text: "❌ *Failed to connect bot session!*" });
        }
    }

    if (command === ".disconnect") {
        if (!fs.existsSync(sessionPath)) {
            return client.sendMessage(m.key.remoteJid, { text: `⚠️ *Session '${sessionName}' is not connected!*` });
        }

        try {
            fs.rmSync(sessionPath, { recursive: true, force: true });
            return client.sendMessage(m.key.remoteJid, { text: `✅ *Session '${sessionName}' has been disconnected!*` });
        } catch (err) {
            console.error(err);
            return client.sendMessage(m.key.remoteJid, { text: "❌ *Failed to disconnect session!*" });
        }
    }

    client.sendMessage(m.key.remoteJid, { text: "❌ *Invalid command! Use:*\n`.connect <session_name>` (Reply to Base64 session)\n`.disconnect <session_name>`" });
};
