const fs = require("fs");
const path = require("path");
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
require("dotenv").config(); // Load environment variables

const SESSION_PATH = path.join(__dirname, "session"); // Session storage path

async function startAuth() {
    try {
        console.log("🔄 Initializing Baileys authentication...");
        
        const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH); 
        const { version } = await fetchLatestBaileysVersion(); // Get latest Baileys version

        const client = makeWASocket({
            version,
            auth: state,
            printQRInTerminal: true, // Show QR Code in terminal for first-time auth
            logger: pino({ level: "silent" }), // Silent logging mode
            browser: ["VOX-MD", "Chrome", "1.0"], // Bot Identity
            syncFullHistory: true, // Sync all messages when reconnecting
        });

        // Event: Save session credentials automatically
        client.ev.on("creds.update", saveCreds);

        // Event: Handle incoming messages
        client.ev.on("messages.upsert", async (m) => {
            require("./dreaded")(client, m.messages[0], null, null);
        });

        // Event: Handle disconnection
        client.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "open") {
                console.log("✅ Connected to WhatsApp!");
            } else if (connection === "close") {
                const reason = lastDisconnect?.error?.output?.statusCode;

                if (reason === DisconnectReason.loggedOut) {
                    console.log("⚠️ Session expired! Delete 'session' folder and restart.");
                    process.exit(1);
                } else {
                    console.log("🔄 Reconnecting...");
                    startAuth(); // Auto-restart bot on disconnection
                }
            }
        });

        return client; // Return client instance for further use
    } catch (error) {
        console.error("❌ Authentication error:", error);
        process.exit(1);
    }
}

module.exports = { startAuth };
