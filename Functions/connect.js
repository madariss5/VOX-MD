const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

let connectedBots = {};

async function connectBot(base64Session, mainClient) {
    try {
        // Decode Base64 Session Data
        let sessionString = Buffer.from(base64Session, 'base64').toString('utf-8').trim();
        
        // Check if JSON is valid before parsing
        if (!sessionString.startsWith('{') || !sessionString.endsWith('}')) {
            throw new Error("Invalid session format. Ensure the session is a valid JSON.");
        }

        let state = JSON.parse(sessionString); // ✅ Now it's properly validated

        const { state: authState, saveCreds } = await useMultiFileAuthState(`./sessions/${Date.now()}`);

        const botClient = makeWASocket({
            logger: pino({ level: 'silent' }),
            auth: authState,
            printQRInTerminal: false,
            browser: ["VOX-MD Bot", 'Safari', '3.0']
        });

        botClient.ev.on("creds.update", saveCreds);

        botClient.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "open") {
                if (!botClient.user) {
                    console.error("❌ Error: botClient.user is undefined. Waiting...");
                    return;
                }

                let botJid = botClient.user.id;
                connectedBots[botJid] = botClient;
                await mainClient.sendMessage("254114148625@s.whatsapp.net", { text: `✅ Bot connected: ${botJid}` });
                console.log(`✅ Bot connected: ${botJid}`);
            } else if (connection === "close") {
                let botJid = botClient.user?.id;
                if (botJid) {
                    delete connectedBots[botJid];
                    console.log(`❌ Bot disconnected: ${botJid}`);
                }
            }
        });

    } catch (err) {
        console.error("❌ Error connecting bot:", err.message);
    }
}

async function disconnectBot(botJid, mainClient) {
    if (connectedBots[botJid]) {
        connectedBots[botJid].end();
        delete connectedBots[botJid];
        await mainClient.sendMessage("254114148625@s.whatsapp.net", { text: `🚫 Bot disconnected: ${botJid}` });
        console.log(`🚫 Bot disconnected: ${botJid}`);
    } else {
        await mainClient.sendMessage("254114148625@s.whatsapp.net", { text: `⚠️ No bot found with JID: ${botJid}` });
    }
}

function listBots() {
    return Object.keys(connectedBots);
}

module.exports = {
    connectBot,
    disconnectBot,
    listBots
};
