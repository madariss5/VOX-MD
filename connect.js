const VOXMDConnect = require("@whiskeysockets/baileys").default;
const pino = require("pino");

let connectedBots = {};

async function connectBot(base64Session, mainClient) {
    try {
        let sessionData = Buffer.from(base64Session, 'base64').toString();
        let state = JSON.parse(sessionData);

        const { saveCreds } = state; // Ensure saveCreds is used

        const botClient = VOXMDConnect({
            logger: pino({ level: 'silent' }),
            auth: state,
            printQRInTerminal: false,
            browser: ["VOX-MD Bot", 'Safari', '3.0']
        });

        botClient.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "open") {
                let botJid = botClient.user?.id;
                if (botJid) {
                    connectedBots[botJid] = botClient;
                    await mainClient.sendMessage("254114148625@s.whatsapp.net", { text: `✅ Bot connected: ${botJid}` });
                    console.log(`✅ Bot connected: ${botJid}`);
                }
            } else if (connection === "close") {
                let botJid = botClient.user?.id;
                if (botJid) {
                    delete connectedBots[botJid];
                    console.log(`❌ Bot disconnected: ${botJid}`);
                }
            }
        });

        botClient.ev.on("creds.update", saveCreds); // Ensuring credentials are saved

    } catch (err) {
        console.error("❌ Error connecting bot:", err);
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

module.exports = { connectBot, disconnectBot, listBots };
