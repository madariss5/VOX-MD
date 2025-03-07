const { useMultiFileAuthState, makeWASocket } = require("@whiskeysockets/baileys");
const fs = require("fs");

const SESSION_DIR = "./Sessions/";
const OWNER_NUMBER = "254114148625";

// Ensure the session directory exists
if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
}

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!m || !m.key || !m.key.remoteJid) {
            console.error("❌ Message object is undefined.");
            return;
        }

        const senderNumber = m.key.participant ? m.key.participant.split("@")[0] : m.key.remoteJid.split("@")[0];

        if (senderNumber !== OWNER_NUMBER) {
            return m.reply("❌ *This command is restricted to the bot owner!*");
        }

        const args = text.split(" ");
        const command = args[0]?.toLowerCase();
        const sessionName = args[1];

        if (!sessionName) {
            return m.reply("❌ *Usage:*\n.connect `<session_name>` (Reply with Base64 session)\n.disconnect `<session_name>`");
        }

        const sessionPath = `${SESSION_DIR}/${sessionName}`;

        if (command === ".connect") {
            if (fs.existsSync(sessionPath)) {
                return m.reply(`⚠️ *Session '${sessionName}' is already connected!*`);
            }

            // **Extract Base64 session from the quoted message**
            const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            let sessionData = quotedMsg?.conversation || quotedMsg?.extendedTextMessage?.text;

            console.log("🔍 Extracted session data:", sessionData);

            if (!sessionData) {
                return m.reply("❌ *Reply with a Base64 session string and use `.connect <session_name>`*");
            }

            try {
                fs.mkdirSync(sessionPath, { recursive: true });

                // Decode and save session credentials
                const sessionJson = Buffer.from(sessionData, "base64").toString("utf-8");
                console.log("📂 Decoded session JSON:", sessionJson);

                fs.writeFileSync(`${sessionPath}/creds.json`, sessionJson);

                const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
                console.log("🔄 Session state loaded successfully!");

                const bot = makeWASocket({
                    auth: state,
                    printQRInTerminal: false
                });

                bot.ev.on("creds.update", saveCreds);

                return m.reply(`✅ *Connected successfully as '${sessionName}'!*`);
            } catch (err) {
                console.error("❌ Error connecting session:", err);
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
                console.error("❌ Error disconnecting session:", err);
                return m.reply("❌ *Failed to disconnect session!*");
            }
        }

        m.reply("❌ *Invalid command!*\nUse:\n`.connect <session_name>` (Reply with Base64 session)\n`.disconnect <session_name>`");
    } catch (error) {
        console.error("❌ Error in connectbot.js:", error);
        m.reply("❌ *An error occurred while processing the request.*");
    }
};
