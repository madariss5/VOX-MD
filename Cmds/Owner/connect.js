const { default: VOXMDConnect } = require("@whiskeysockets/baileys");

const activeBots = {};

async function connectBot(sessionData, mainClient) {
    const client = await VOXMDConnect({ auth: JSON.parse(sessionData) });
    activeBots[client.user.id] = client;
    mainClient.sendMessage(mainClient.user.id, { text: `✅ Bot connected: ${client.user.id}` });
}

async function disconnectBot(botJid, mainClient) {
    if (activeBots[botJid]) {
        delete activeBots[botJid];
        mainClient.sendMessage(mainClient.user.id, { text: `✅ Bot disconnected: ${botJid}` });
    }
}

module.exports = { connectBot, disconnectBot };
