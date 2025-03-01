const { makeWASocket, useSingleFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Load environment variables

// Load session from .env or session file
const { state, saveState } = useSingleFileAuthState("./session.json");

// Create WhatsApp connection
const startBot = () => {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // Show QR code in terminal for manual login
    });

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Connection closed. Reconnecting...", shouldReconnect);

            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === "open") {
            console.log("VOX-MD is online and running!");
        }
    });

    sock.ev.on("creds.update", saveState);

    // Message handler
    sock.ev.on("messages.upsert", async (message) => {
        const m = message.messages[0];
        if (!m.message) return;
        
        const from = m.key.remoteJid;
        const msgType = Object.keys(m.message)[0];
        const text = msgType === "conversation" ? m.message.conversation : 
                     msgType === "extendedTextMessage" ? m.message.extendedTextMessage.text : "";

        console.log(`Message from ${from}: ${text}`);

        if (text.toLowerCase() === "!ping") {
            await sock.sendMessage(from, { text: "Pong!" });
        }

        // Auto-remove links in group chats
        if (from.endsWith("@g.us") && text.match(/https?:\/\/\S+/gi)) {
            await sock.groupParticipantsUpdate(from, [m.key.participant], "remove");
            await sock.sendMessage(from, { text: "Links are not allowed!" });
        }
    });

    // Keep process alive
    setInterval(() => {}, 1000 * 60 * 60);
};

// Start the bot
startBot();
